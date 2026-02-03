import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Actual script implementation
df = pd.read_csv("pt-data.csv")
t_col = "Time (s) Run 1"
y_col = "Position (m) Run 1"

# Clean and filter for the specified time interval
df_clean = df[[t_col, y_col]].dropna()
df_filtered = df_clean[(df_clean[t_col] >= 0) & (df_clean[t_col] <= 0.75)]

t_data = df_filtered[t_col].values
y_data = df_filtered[y_col].values

# Theoretical model
t_model = np.linspace(0, 0.75, 200)
y_theory = 0.039 * t_model**3 + 0.325 * t_model**2

# Data fit line (Cubic polynomial)
coeffs = np.polyfit(t_data, y_data, 3)
poly_fit = np.poly1d(coeffs)
y_fit = poly_fit(t_model)

# Plotting
plt.style.use("ggplot")
plt.figure(figsize=(10, 6))

plt.scatter(t_data, y_data, color="black", s=20, alpha=0.6, label="Experimental Data")
plt.plot(
    t_model,
    y_theory,
    color="blue",
    linestyle="--",
    linewidth=2,
    label=r"Theory: $0.039t^3 + 0.325t^2$",
)
plt.plot(
    t_model,
    y_fit,
    color="red",
    linewidth=1.5,
    label=f"Data Fit: {coeffs[0]:.3f}$t^3$ + {coeffs[1]:.3f}$t^2$ + {coeffs[2]:.3f}$t$ + {coeffs[3]:.3f}",
)

plt.title("Comparison of Theoretical Model vs. Empirical Data Fit", fontsize=14)
plt.xlabel("Time $t$ (s)", fontsize=12)
plt.ylabel("Position $y$ (m)", fontsize=12)
plt.xlim(0, 0.75)
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
print(f"Fit Coefficients: {coeffs}")
