
Suppose $X \gt 0$
$$X = 10^K \cdot M $$
where $K$ is an integer and $1 \leq M \leq 10$

$$\log_{10}X = K + \log_{10}M$$

Since $1 \leq M \leq 10$, we have $0 \leq \log_{10}M \leq 1$

So $\log_{10}M$ is just the fractional part of $\log_{10}X$.

For example:

$X = 3140 = 10^3 \times 3.14$

$\log_{10}(3140) \approx 3 + \log_{10}(3.14) = 3.497$

The integer part 3 gives the order of magnitude, $10^3$. The fractional part 0.497 tells us where inside that order of magnitude the number sits.

# Distribution of first digit

The first digit of $X$ is $k$ if $k \leq M < k+1$, i.e.,

$$\log_{10}k \leq \log_{10}M < \log_{10}(k+1)$$

$$P(D = k) = P(\log_{10}k \leq \log_{10}M < \log_{10}(k+1))$$

If $\log_{10}M \sim \text{Uniform}(0,1)$, then

$$P(D=k) = \log_{10}(k+1) - \log_{10}k$$

This is Benford's Law, and it hinges on that uniformity assumption.

So Benford's law is the statement:

$$\{\log_{10} X\} = \log_{10}M \sim \text{Uniform}(0,1),$$

where $\{z\}$ denotes the fractional part of $z$.

## Where does the CLT enter

Suppose

$$X = A_1 A_2 \cdots A_n.$$

Then

$$\log_{10}X = \log_{10}A_1 + \cdots + \log_{10}A_n.$$

By the CLT, this sum tends to look Normal:

$$\log_{10}X \approx N(\mu, \sigma^2).$$

The key point: a **wide Normal distribution**, when wrapped around the unit interval by taking fractional parts, becomes approximately $\text{Uniform}(0,1)$.

## Start with a small Normal

Suppose $Z \sim N(3.2,\ 0.01)$.

This is tightly concentrated around 3.2. Most values are near $3.1,\ 3.2,\ 3.3$.

Taking fractional parts gives values near $0.1,\ 0.2,\ 0.3$.

So $\{Z\}$ is **not** $\text{Uniform}(0,1)$ — it is concentrated near 0.2. The wrapped version still has a strong peak.

---

## Now make the Normal wide

Suppose instead $Z \sim N(3.2,\ 100)$.

Now $Z$ is spread over many intervals:

$$\ldots,\ [0,1),\ [1,2),\ [2,3),\ [3,4),\ [4,5),\ \ldots$$

When we take fractional parts, each interval gets folded onto $[0,1)$. For example, all of these land at fractional part 0.37:

$$0.37,\ 1.37,\ 2.37,\ 3.37,\ 4.37,\ \ldots$$

So the density of $\{Z\}$ at 0.37 is roughly:

$$f_Z(0.37) + f_Z(1.37) + f_Z(2.37) + f_Z(3.37) + \cdots$$

More generally, for $0 \le r < 1$,

$$f_{\{Z\}}(r) = \sum_{k=-\infty}^{\infty} f_Z(k+r).$$

That is the "wrapped" density.

---

## Why this becomes almost flat

A wide Normal changes slowly over a distance of 1. So comparing the wrapped density at two fractional parts, say 0.2 and 0.7, means comparing

$$\sum_k f_Z(k + 0.2) \quad \text{against} \quad \sum_k f_Z(k + 0.7).$$

When the Normal is very wide, moving from $k + 0.2$ to $k + 0.7$ barely changes the height of the curve. The sums are nearly the same:

$$\sum_k f_Z(k+0.2) \approx \sum_k f_Z(k+0.7).$$

If every $r \in [0,1)$ gets approximately the same total density, then

$$\{Z\} \approx \text{Uniform}(0,1).$$

That is the core idea.

## Why this matters for Benford

For Benford, we care about $\{\log_{10}X\}$. If $X$ comes from many multiplicative factors, then $\log_{10}X$ is approximately Normal by the CLT. If that Normal is wide enough,

$$\{\log_{10}X\} \approx \text{Uniform}(0,1).$$

And if the fractional log is uniform, then

$$P(D=j) = \log_{10}(j+1) - \log_{10}(j) = \log_{10}\!\left(\frac{j+1}{j}\right).$$

That is Benford's law.
