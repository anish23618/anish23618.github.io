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
The statement "rapidly" is subjective and will be defined as

$$d(\mu_i,\mu_j)\leq \epsilon|i-j|$$

for some small $\epsilon$, and the distance between two distribution $f(x)dx$ and $g(x)dx$ is given by

$$d(f(x)dx,g(x)dx) = \sqrt{\int |f(x)-g(x)|^2 dx}$$

Note, that here we will work with distributions which fall in $L^1\cap L^2$ to avoid problems arising from extreme behaviors.

Now, we have enough to desribe the algorithm we will follow. 
Basically this is random forest algorithm, but instead of building trees to predict the target, we are building tree to classify such that all the bins have equal counts.
Because we are building a forest, we want to build $M$ random trees of depth $h$, for that we follow:
1) randomly take a coordinate $i$ from $1$ to $d$
2) compute the median for the data in consideration for that coordinate (say $m_i$)
3) divide the data into using the median into left and right segment based on the median, hence for current branch the selection coordinate is $i$ and dividing value is $m_i$
4) if are in depth $h-1$ stop, if not for each branch go back to step 1 and repeat.

This process will create a tree which divide the input data into equal buckets. Now repeating it $M$ times give us the $M$ trees. 
As you can see, this is highl parallelizable and will be extremely fast.
