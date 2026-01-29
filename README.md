# Real-Estate-Price-Prediction

Notebook-based workflow for cleaning, feature engineering, outlier removal, and model training on the Bengaluru house price dataset.

## Dataset
- Source: Kaggle dataset `amitabhajoy/bengaluru-house-price-data`
- Downloaded programmatically with `kagglehub`

## What the notebook does
1. **Data loading**
   - Downloads the dataset via `kagglehub` and reads it with `pandas`.
2. **Cleaning & preprocessing**
   - Drops unused columns (`area_type`, `society`, `balcony`, `availability`).
   - Removes rows with missing values.
   - Extracts `bhk` from the `size` column.
   - Normalizes `total_sqft` by converting ranges (e.g., `2100 - 2850`) and units (e.g., `Sq. Meter`, `Perch`) to numeric square feet.
3. **Feature engineering**
   - Adds `price_per_sqft`.
   - Strips whitespace from `location` and groups rare locations into `other`.
4. **Outlier removal**
   - Removes listings with `total_sqft / bhk < 300`.
   - Removes `price_per_sqft` outliers per location (using mean ± std).
   - Removes BHK outliers where larger BHK homes are priced lower than smaller ones (per-location stats).
   - Filters abnormal bathroom counts (`bath > bhk + 2`).
5. **Model building & evaluation**
   - One-hot encodes `location` (drops the `other` column to avoid dummy trap).
   - Trains a `LinearRegression` model and evaluates with train/test split.
   - Runs cross-validation with `ShuffleSplit`.
   - Compares models using `GridSearchCV` (`LinearRegression`, `Lasso`, `DecisionTreeRegressor`).
6. **Prediction helper**
   - `predict_price(location, sqft, bath, bhk)` for ad-hoc predictions.
7. **Artifacts**
   - Saves the trained model to `banglore_home_prices_model.pickle`.
   - Saves feature columns to `columns.json`.

## Requirements
Install dependencies from `requirement.txt`:

```bash
pip install -r requirement.txt
```

## Run
Open `main.ipynb` in Jupyter or VS Code and run the cells in order.
