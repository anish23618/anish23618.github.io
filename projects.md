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
## 📐 Spectral Multiplicity for Random Operators with Projection-Valued Randomness
* **Domain:** Spectral Theory, Mathematical Physics & Infinite-Dimensional Operators
* **Core Problem:** Determining the multiplicity bounds of the singular spectrum for a generalized class of self-adjoint random operators.
  While the standard Anderson tight-binding model (rank-1 projections on $`\ell^2(\mathbb{Z}^d)`$) has a verified simple singular spectrum,
  establishing similar bounds for continuous random Schrödinger operators ($`L^2(\mathbb{R}^d)`$, infinite-rank projections) remains an open challenge.
#### Mathematical Formulation & Methodology
The system models a family of random operators decomposed as:

$$H_\omega = H_0 + \sum_{n} \omega_n P_n$$

Where:
* $H_0$ is a fixed, unperturbed self-adjoint operator.
* $\{P_n\}$ is a countable family of finite, uniform-rank orthogonal projections.
* $\{\omega_n\}$ are independent, real-valued random variables acting as stochastic perturbations.

#### Key Contributions & Results
* **Subspace Unitary Equivalence:** Established the exact algebraic and topological conditions under which the cyclic, invariant subspaces associated with distinct projection operators $\{P_n\}$ under the action of $H_\omega$ are unitarily equivalent.
* **Singular Subspace Localization:** Proved that the total singular subspace of the random operator can be completely characterized by the singular subspace invariant under the action of $H_\omega$ for a *single* representative projection from the family.
* **Multiplicity Bounding via Herglotz Functions:** Demonstrated that this structural reduction allows the singular spectral measure to be analyzed directly via the matrix-valued Herglotz (Nevanlinna) functions of a solitary projection. This framework successfully provides a concrete upper bound on the multiplicity of the operator's singular spectrum, serving as a critical intermediate bridge toward solving infinite-rank continuum models.

---
## 🔷 Scissors Congruence and Hilbert's 3rd Problem
* **Domain:** Geometric Topology, Homological Algebra & Equidecomposability
* **Core Problem:** Investigating the algorithmic boundaries of equidecomposability (scissors congruence) across dimensions. While any two polygons of equal area in $\mathbb{R}^2$ are scissors-congruent via simple triangulation (the Wallace–Bolyai–Gerwien theorem), Max Dehn proved in 1901 that this fails in higher dimensions—meaning a regular tetrahedron cannot be cut and rearranged into a cube of equal volume.

#### Mathematical Formulation & Methodology
The project explores the classification of equidecomposable polytopes by formalizing the structure of the **Dehn Invariant**. 
For a polytope $P$ in $\mathbb{R}^3$ with edges $e$, edge lengths $\ell(e)$, and internal dihedral angles $\theta(e)$, 
the invariant $\mathcal{D}(P)$ is defined as an element of the tensor product space:

$$\mathcal{D}(P) = \sum_{e} \ell(e) \otimes \theta(e) \in \mathbb{R} \otimes_{\mathbb{Z}} (\mathbb{R} / \pi\mathbb{Z})$$

Rather than taking a purely classical geometric path, this project implements a proof framework using **Homological Algebra**. 
By mapping the scissors congruence problem to chain complexes and group homology, the equidecomposability of a polytope is evaluated as a structural obstruction inside an algebraic group framework.

---
## 🦅 Avian Flocking & Emergent Collective Dynamics
* **Domain:** Self-Organizing Systems & Kinematic Boundary Constraints
* **Live System Deployment:** 🕹️ **[Launch Interactive Simulation](./simulations/cellInteraction.html)**

#### System Architecture & Local Rules
The simulation handles three distinct, co-existing agent species operating within a bounded 2D continuous space. At each discrete time-step $\Delta t$, an individual agent's vector orientation is updated based on localized neighborhood constraints:

1. **Stochastic Thermal Perturbation:** A random kinematic "kick" vector is applied to avoid deterministic traps.
2. **Intra-Species Homogeneity Rules:** * **Velocity Alignment:** The agent senses similar types within an observation arc and rotates its velocity vector to match the forward-facing velocity of its neighbors.
   * **Proximity Repulsion:** If local density breaches a critical safety radius, an explicit inverse distance-weighted repulsion force is injected to maintain collision-free packing.
3. **Inter-Species Heterogeneous Interference:** * **Stochastic Intercept Escape:** Encountering a foreign species triggers a distance-dependent probabilistic vector flip to run in the exact opposite direction.
   * **Perceptual Cross-Evasion:** If a foreign agent enters the forward-facing visual field, a lateral perpendicular velocity vector is randomly generated to break line-of-sight.
4. **Boundary Condition Inversion:** A continuous soft-repulsion potential field is mapped onto the canvas coordinates to gracefully push agents back into bounds without sharp momentum loss.
5. **Velocity Normalization:** The total aggregate velocity vector is strictly normalized to a unit vector, preserving uniform velocity bounds across all agents.

#### Key Contributions & Observations
* **Rapid Phase-Transition Clustering:** Demonstrated that even with high noise (stochastic kicks) and multi-species friction, local rules consistently trigger immediate phase transitions into stable, moving macro-clusters.
* **Complex Spatial Partitioning:** Observed emergent segregation boundaries where competing species naturally construct fluid, non-overlapping spatial territories based entirely on local repulsion rules—providing a solid client-side foundation for studying multi-agent space-state exploration.

---
## 📐 Vanilla JS 3D Rasterization Engine & Wave Dynamics Simulator
* **Domain:** Computer Graphics Architecture, Discrete Coordinate Geometry & Wave Kinematics
* **Live System Deployment:** 🕹️ **[Launch 3D Simulation](./simulations/3dPlaneWave.html)**
* **Core Problem:** Implementing a real-time, lightweight 3D graphics pipeline inside a 2D HTML5 canvas context without relying on WebGL or external matrix libraries. The software models a continuous time-evolution wave function traversing an interconnected, non-rigid triangular lattice.

#### System Architecture & Linear Algebra Framework
Built completely in vanilla JavaScript (circa 2011–2013), this engine constructs a custom software-rendering pipeline mapping three-dimensional physics states down to a dynamic two-dimensional viewport:

1. **Orthographic/Weak Perspective Projection:** Maps a three-dimensional vertex matrix $\mathbf{X} = (x, y, z)^T$ directly to screen coordinate components via scalar translation, rotations, and trigonometric skew transforms.
2. **Dynamic Face-Filling & Custom Rasterization:** Organizes vertices into a discrete triangular lattice topology. Faces are explicitly filled using continuous color interpolation to mimic volumetric surfaces based on real-time vertex displacement.
3. **Specular/Lambertian Approximation Shader:** Implements a localized surface-normal algorithm calculating face illumination relative to a fixed screen-space lighting vector. Ray-surface dot products are evaluated to vary color density dynamically, though tracking edge-cases at extreme angles highlights classical back-face culling limitations.
4. **Phase Space / Velocity Lattice Mapping:** The dual-pane architecture runs parallel canvas instances:
   * **Left Viewport:** The spatial domain displaying the deformation wave moving through the surface topology.
   * **Right Viewport:** The velocity phase-space diagram tracking the evolution vectors of individual lattice nodes connected by congruent edge structures.

#### Key Contributions & Insights
* **Deterministic Matrix Calculations:** Hand-coded the foundational transformation matrices, vector normal computations, and face ordering required for raw graphic rendering.
* **Complex Spatial Dual-Visualization:** Successfully linked a dynamic physical simulation with its corresponding phase-space topology in real time, demonstrating early full-stack computing efficiency.
