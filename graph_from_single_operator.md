# Consequence of single operator representation for elementary operators

In march 2026, the article ![All elementary functions from a single operator](https://arxiv.org/html/2603.21852v2) was released talking about 
how all the elementary operations in mathematics can be done using

$$\phi(x,y) = \exp(x)-\ln(y)$$

At first, it might seem counter intuitive. Take the following example

$$e = \phi(1,1)$$
$$\exp(x) = \phi(x,1)$$
$$0 = \phi(1,\exp(e))=\phi(1,\phi(e,1))=\phi(1,\phi(\phi(1,1),1))$$

You can see that using $\phi$ only, writing $e$ is easy, but writing $0$ is complicated when only $1$ is allowed.
In this article, we will view any number or operations as composition of $\phi$ only and remove any other number other than 1.
For example

$$\frac{e}{x} = \exp(\phi(0,x))=\phi(\phi(0,x),1)$$

where, $0$ is replaced by previous expression. Another example is

$$\ln(x) = \phi(0,e/x) = \phi(0,\phi(\phi(0,x),1))$$

which can be used to give

$$\frac{x}{y} = \exp(\ln(x)-\ln(y))=\phi(\phi(\ln(\ln(x)),y),1)$$

$$\frac{1}{x} = \exp(\ln(1)-\ln(y)) = \exp(1-\ln(e*y))$$
