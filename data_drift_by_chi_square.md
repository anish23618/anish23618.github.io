<style>
  .wrapper {
    max-width: 80% !important;
    width: 80% !important;
  }
  section {
    max-width: 100% !important;
    width: 100% !important;
  }
</style>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      processEscapes: true
    }
  });
</script>
<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
</script>


# Detecting data drift in hight dimension through $\chi^2$ test

In today’s data-driven landscape, the focus often centers on building high-performing models that meet business KPIs during development. 
However, reality of production environments is that model performance is rarely static.
Models often perform well at launch, only to suffer from performance degradation or erratic behavior as time progresses. 
This phenomenon, commonly known as Data Drift, can stem from several structural failures:

- **Training-Serving Skew**: Data cleaning or feature engineering pipelines used during training do not accurately mirror the real-world data.
- **Concept/Covariate Drift**: The distribution of the input data evolves, rendering the training data obsolete.
- **Sampling Bias**: The training data was sampled in a way that failed to represent the actual deployment population.
- **Data Leakage**: Target signals were introduced into the input features, leading to inflated performance metrics that collapse once these signals vanish in production.

While the latter two are typically addressed during the planning phase, Data Drift (specifically covariate shift) is an ongoing operational challenge. 
To maintain model health, we need a robust, statistical method to detect when the production data distribution has diverged from the training distribution. 

In this article, we will focus on a particular type of systems. We will assume that the training data is $(x_i,y_i)_{i=1}^N$ where the inputs are $x_i\in\mathbb{R}^d$ and $y_i$ are output.
We don't care about the modelling step itself, hence we will not work with $y_i$ at all, hence we will not differentiate between regression or classification problem.
We will also assume that the distribution of $x_i$ follows $\mu_i$ which is absolutely continuous distribution (i.e there is a pdf for the distibution) and the distibution is not changing rapidly.
The algorithm described here is meant for high dimensional data, and using it in low dimension will have unexpacted behavior.
This is mostly because the algorithm relies on the fact that there is enough degree of freedow so that $\chi^2$ test is performed is reliable as statistics.
Note that, by high dimension we mean $\sqrt{N}\in o(d)$, while this is not strictly required, this is a good enough metric for this article.

The statement "rapidly" is subjective and will be defined as

$$d(\mu_i,\mu_j)\leq \epsilon|i-j|$$

for some small $\epsilon$, and the distance between two distribution $f(x)dx$ and $g(x)dx$ is given by

$$d(f(x)dx,g(x)dx) = \sqrt{\int |f(x)-g(x)|^2 dx}$$

Note, that here we will work with distributions which fall in $L^1\cap L^2$ to avoid problems arising from extreme behaviors.

Now, we have enough to desribe the algorithm we will follow. 
Basically this is random forest algorithm, but instead of building trees to predict the target, we are building tree to classify such that all the bins have equal counts.
Because we are building a forest, we want to build $M$ random trees of depth $h$, for that we follow:

```python
def buildTree(X:np.array,depth:int,coordinates:np.array):
    coord = np.random.choice(coordinates)
    median = np.median(X[coord])
    if depth>1:
        return {
            'left':(coord,median,buildTree(X[X[coord]<median],depth-1)),
            'right':(coord,median,buildTree(X[X[coord]>median],depth-1)),
        }
    else:
        return {
            'left':(coord,median,np.sum(X[coord]<median)),
            'right':(coord,median,np.sum(X[coord]>median)),
        }
```

This process will create a tree which divide the input data into equal buckets. Now repeating it $M$ times give us the $M$ trees. 
As you can see, this is highly parallelizable and can be performed with CBLAS/LAPAC packages implemented as library.
It should be noted that the pseudocode is written for clarity of understanding rather than optimized for execution.
Note that the argument `coordinates` are the set of coordinates from which we want to choose to build the tree.
In practical terms, we don't want to let the `coordinates` set's size to exceed the depth, but there is no such restriction.
For the forest, we should select the `coordinates` set randomly from all possible coordinate.

Now lets start analyzing what the forest algorithm will do. 
Lets assume we have:
- the training data $(x_i)_{i=1}^N$ are i.i.d following distribution $\mu$ on $\mathbb{R}^d$,
- $d$ is large compared to $N$,
- $N = N_1 2^h$ (no. of points in the training data is multiple of power of 2),
- We are building $M$ trees of depth $h$,
- the `coordinates` set is selected randomly for each tree of size $h$,
- $h\ll d$, i.e depth of tree is far smaller than dimension
- The trees are enumerated as $T_j$ for $j=1\cdots M$.

First, give a coordinates set, probability of getting it is

$$\mathbb{P}[coordinates=given~coordinates] = \frac{h\!}{d^h}\leq (h/d)^h$$

that means the probability of two trees selecting same coordinates is $\sim M^2 (h/d)^h$.
We want this number to be small. On other hand, we wnat to cover all coordinates, for that we have

$$\mathbb{P}[i ~not ~in ~any ~cooridnates] \sim (1-1/d)^{Mh}\sim e^{-\frac{Mh}{d}}$$

which means $Mh>>d$. This also gives us the condition that we should not take $h\leq 2$.

Next, because we are creating tree of depth $h$, the leave nodes have same number of elements (because of our choice of $N$), and they are $N_1$.
For each tree, this process divided the space into equi-probable zones (w.r.t training data) which will be $2^{-h}$.
That means if we define a random variable $z$ where it can take values from $1$ to $2^h$ with equal probability and it is sampled $N$ times, the distibution for any one bin is

$$\mathbb{P}[\sum_{i=1}^N\chi(z_i=j)=m] = C^N_m 2^{-h m} (1-2^{-h})^{N-m}$$

If $N*2^{-h}=N_1$ is small, this distribution converges to poison, and the analysis will break down. 
We want $N_1$ to large enough that above distribution can be assumed to be gaussian.
In practice $N_1$ can be taken as small as $15$, but larger value would be prefered.

Now, suppose we want to test if the points $\tilde{X} = (\tilde{x}_i)_{i=1}^K$ follow same distribution, 
so for each tree $T_j$, we have the vector $(m_1,\cdots,m_{2^h})$ where $m_i$ denotes number of $\tilde{x}_j$ which lies in the leaf $i$.
The probability vector is given by $(m_1/K,\cdots,m_{2^h}/K)$.
Because of our construction, the training data had probability $2^{-h}$ for all the leaves, hence we can define the statistics

$$\chi(\tilde{X}) = \sum_{i=1}^{2^h} \frac{(2^{-h}K-m_i)^2}{2^{-h}K}$$

define for the tree $T_j$ the statistics

$$\mathcal{T}_j(\tilde{X}) = K\sum_{i=1}^{2^h} \frac{(2^{-h}K-m_{i,j})^2}{2^{-h}K}~~~\forall~1\leq j\leq M$$

where $m_{i,j}$ is the number of $\tilde{X}$ which falls in leaf $i$ for the tree $j$.
It should be clear from definition that $\mathcal{T}_j(\tilde{X})$ follows $\chi^2$ distribution with degrees of freedom $2^h-1$. 

If the trees does not have any overlap on coordinates it is easy to see that $\mathcal{T}_j(\tilde{X})$ are i.i.d and all follow same distribution.
But even if the trees have overlapping coordinates, we can assume this because of high dimensionality.
So now defining

$$p_j = \mathbb{P}\[\chi^2_{2^h-1}\geq \mathcal{T}_j(\tilde{X})\]$$

we aggregate all the trees result as

$$\mathcal{S} = -2\sum_j \ln(p_j),$$

under null hypothesis of no-drift, $\mathcal{S}$ follows $\chi^2$ with degrees of freedom $2M$.


