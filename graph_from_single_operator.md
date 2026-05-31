# Consequence of single operator representation for elementary operators

In march 2026, the article ![All elementary functions from a single operator](https://arxiv.org/html/2603.21852v2) was released talking about 
how all the elementary operations in mathematics can be done using

$$\phi(x,y) = \exp(x)-\ln(y)$$

At first, it might seem counter intuitive. Take the following example

$$e = \phi(1,1)$$
$$\exp(x) = \phi(x,1)$$
$$0 = \phi(1,\exp(e))=\phi(1,\phi(e,1))=\phi(1,\phi(\phi(1,1),1))$$

You can see that using $\phi$ only, writing $e$ is easy, but writing $0$ is complicated when only $1$ is allowed.
In this article we will view

$$\phi:\mathbb{C}\times\mathbb{C}\rightarrow\mathbb{C}$$

where $\phi$ is analytic in first and second variable. Also note that $\phi(x,\cdot)$ has a singularity at $0$, so what follows, 
we will always view any expression containing a variable as analytic function which are extented to natural domain. 
That is, for example $\exp(\ln(\ln(x)))$ will have a singularity at $0$, not $1$, because the analytic continuity will not have singularity at $1$.

The goal of this article to build a tree trees and show equivalance within the trees for numbers and equation normally encoutered.
We will view any number or operations as composition of $\phi$ only and remove any other number other than 1.
In the previous example, we have written $0$ interms of composition of $\phi$ and $1$. 
But, sometimes we will leave other number in expression, as long as we have expressed before. Take the following example:

$$\frac{e}{x} = \exp(\phi(0,x))=\phi(\phi(0,x),1)$$

where, $0$ can be replaced by previous expression. Another example is

$$\ln(x) = \phi(0,e/x) = \phi(0,\phi(\phi(0,x),1))$$

Now using this we have

$$x-y = \phi(\ln(x),\exp(y)) = \phi(\phi(0,\phi(\phi(0,x),1)),\phi(y,1))$$

Note that while $x$ seems to have a singularity at zero, the expression does not, hence evaluable.
To avoid performing $0-y$ evalutation for $x+y$,we have

$$-y = (1-y)-1 = \phi(0,\exp(y))-1 = \phi(\phi(0,\phi(\phi(0,\phi(0,\phi(y,1))),1)),\phi(1,1))$$

hence, we have

$$x+y = x-(-y).$$

Once we have the sum, product is

$$x\cdot y = \exp(\ln(x)+\ln(y)).$$
