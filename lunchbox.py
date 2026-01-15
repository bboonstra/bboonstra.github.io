import numpy as np
import matplotlib.pyplot as plt

# Data
x = np.array([2.2, 2.1, 2.0, 1.8, 1.5, 1.3, 1.5, 1.2, 1.3, 1.9, 1.8, 2.5])
y = np.array([11.9, 9.1, 10.1, 8.0, 5.4, 3.2, 4.9, 4.1, 3.2, 9.8, 8.4, 14.0])

# Best-fit line
m, b = np.polyfit(x, y, 1)

# Uncertainty in slope and intercept
y_fit = m * x + b
print(b)
residuals = y - y_fit
n = len(x)
s_y = np.sqrt(np.sum(residuals**2) / (n - 2))
x_mean = np.mean(x)
Sxx = np.sum((x - x_mean)**2)
sigma_m = s_y / np.sqrt(Sxx)
sigma_b = s_y * np.sqrt(np.sum(x**2) / (n * Sxx))

m_max, m_min = m + sigma_m, m - sigma_m
b_max, b_min = b + sigma_b, b - sigma_b

# Grid setup
x_min, x_max = 0, 2.5
y_min, y_max = -10, 15
n_x_squares = 45
n_y_squares = 60

# Plot
fig, ax = plt.subplots(figsize=(6, 8))  # rectangle of rough 45:60 ratio
ax.scatter(x, y, color="blue")
x_line = np.linspace(x_min, x_max, 200)
ax.plot(x_line, m * x_line + b, color="black", label="Best fit")
ax.plot(x_line, m_max * x_line + b_max, linestyle="--", color="red", label="Steepest")
ax.plot(x_line, m_min * x_line + b_min, linestyle="--", color="green", label="Least steep")

# Configure axes
ax.set_xlim(x_min, x_max)
ax.set_ylim(y_min, y_max)
ax.set_xticks(np.linspace(x_min, x_max, n_x_squares + 1))
ax.set_yticks(np.linspace(y_min, y_max, n_y_squares + 1))
ax.grid(True)
ax.set_xticks(np.linspace(x_min, x_max, n_x_squares//5 + 1), minor=False)  # thicker lines every 5
ax.set_xticks(np.linspace(x_min, x_max, n_x_squares + 1), minor=True)       # thin lines
ax.set_yticks(np.linspace(y_min, y_max, n_y_squares//5 + 1), minor=False)
ax.set_yticks(np.linspace(y_min, y_max, n_y_squares + 1), minor=True)
ax.grid(which='major', linewidth=1.5)
ax.grid(which='minor', linewidth=0.5)

# Make each square physically square
dx = (x_max - x_min) / n_x_squares
dy = (y_max - y_min) / n_y_squares
ax.set_aspect(dx/dy)

# show intercepts

yint_best = b
yint_steep = b_max
yint_least = b_min

ax.scatter([0], [yint_best], zorder=5)
ax.scatter([0], [yint_steep], zorder=5)
ax.scatter([0], [yint_least], zorder=5)

bbox = dict(boxstyle="round,pad=0.25", fc="white", ec="black")

ax.annotate(f"{yint_best:.2f}", (0, yint_best), xytext=(6, 0),
            textcoords="offset points", va="center", bbox=bbox)

ax.annotate(f"{yint_steep:.2f}", (0, yint_steep), xytext=(6, 0),
            textcoords="offset points", va="center", bbox=bbox)

ax.annotate(f"{yint_least:.2f}", (0, yint_least), xytext=(6, 0),
            textcoords="offset points", va="center", bbox=bbox)


ax.text(0.02, 0.95,
        rf"y-intercept = {b:.2f} ± {sigma_b:.2f}",
        transform=ax.transAxes,
        va="top",
bbox = dict(boxstyle="round,pad=0.4", fc="white", ec="black"))


ax.legend()
plt.show()
