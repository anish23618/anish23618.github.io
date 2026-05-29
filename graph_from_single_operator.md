# Consequence of single operator representation for elementary operators

In march 2026, the article ![All elementary functions from a single operator](https://arxiv.org/html/2603.21852v2) was released talking about 
how all the elementary operations in mathematics can be done using

$$\phi(x,y) = \exp(x)-\ln(y)$$

At first, it might seem counter intuitive but here is simple example

$$e = \phi(1,1)$$
$$0 = \phi(1,e)=\phi(1,\phi(1,1))$$

Above two are simple enough, so lets go deeper. Lets look into operations:

$$\exp(x) = \phi(x,1)$$
$$e/x = \exp(\phi(0,x))=\phi(\phi(0,x),1)$$
$$\ln(x) = \phi(0,e/x) = \phi(0,\phi(\phi(0,x),1))$$
$$x-y = \phi(\ln(x),\exp(y))$$
$$x/y = \exp(\ln(x)-\ln(y))=\phi(\phi(\ln(\ln(x)),y),1)$$
