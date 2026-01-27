# Real-Estate-Price-Prediction

Notebook-based workflow for cleaning and feature engineering on the Bengaluru house price dataset, as a first step toward a real-estate price prediction model.

## Dataset
- Source: Kaggle dataset `amitabhajoy/bengaluru-house-price-data`
- Downloaded programmatically with `kagglehub`

## What the notebook does
1. **Data loading** from Kaggle via `kagglehub` and `pandas`
2. **Basic EDA**: dataset shape and category counts
3. **Cleaning**:
   - Drops unused columns (`area_type`, `society`, `balcony`, `availability`)
   - Removes rows with missing values
   - Extracts `bhk` from the `size` column
4. **`total_sqft` normalization**:
   - Handles numeric values and ranges (e.g., `2000 - 3000`)
   - Converts units like `Sq. Meter` and `Perch` to square feet
5. **Feature engineering**:
   - Adds `price_per_sqft`
   - Normalizes `location` and groups rare locations into `other`

## Requirements
Install dependencies from `requirement.txt`:

```bash
pip install -r requirement.txt
```

## Run
Open `main.ipynb` in Jupyter or VS Code and run the cells in order.
