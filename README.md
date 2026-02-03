# Real-Estate-Price-Prediction

End-to-end Bengaluru home price prediction project with a reproducible training notebook, a Flask API for inference, and a lightweight web UI for interactive estimates.

## Highlights
- Cleaned and feature-engineered dataset with robust outlier handling.
- Trained regression model with cross-validation and model comparison.
- Flask API for real-time predictions.
- Static web UI for quick price estimation.

## Dataset
- Source: Kaggle dataset `amitabhajoy/bengaluru-house-price-data`
- Downloaded programmatically with `kagglehub`

## Training pipeline (notebook)
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

## Project layout
- `model/` holds the training notebook (`main.ipynb`) and saved artifacts.
- `server/` contains the Flask API plus `artifacts/` used at runtime.
- `client/` is a static UI that calls the API.

## Prerequisites
- Python 3.9+

## Install
Install dependencies from `requirement.txt`:

```bash
pip install -r requirement.txt
```

## Run locally
1. (Optional) Retrain the model by running `model/main.ipynb`.
2. Ensure the latest artifacts are in `server/artifacts/`.
3. Start the API from the `server` directory so relative artifact paths resolve.

```bash
cd server
python server.py
```

4. Open the UI by loading `client/app.html` in a browser.
5. To point the UI at a different API host, update the `data-api-base` attribute in `client/app.html`.

## API
- `GET /get_location_names` returns the list of locations.
- `POST /predict_home_price` expects form data: `total_sqft`, `location`, `bhk`, `bath`.
- Response includes `estimated_price` in INR lakhs.

## Notes
- The API expects model artifacts at `server/artifacts/` (`columns.json` and `banglore_home_prices_model.pickle`).
- CORS is enabled for all origins in the Flask app to allow the static UI to call the API.
