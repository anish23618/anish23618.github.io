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
def buildTree(X:np.array,depth:int):
    coord = np.random.randint(0,X.shape[1])
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
As you can see, this is highl parallelizable and will be extremely fast.

