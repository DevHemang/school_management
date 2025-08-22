# School Management API (Node.js + MySQL)

This is a basic Node.js project using Express and MySQL. It allows you to:

* Add a new school
* List schools sorted by distance from your location

---

## How to Run

### 1. Clone the project

```bash
git clone https://github.com/DevHemang/school_management.git
cd school-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL database

* Create a database in MySQL (e.g., `school_db`)
* Run the `school_management.sql` file to create the `schools` table
* You can also add some sample data

### 4. Create a `.env` file in the root directory with your DB info:

```env
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=school_db
PORT=3000
```

### 5. Start the server

```bash
node server.js
```

---

## API Endpoints

### 1. Add School

* **URL:** `/addSchool`
* **Method:** `POST`
* **Body (JSON):**

```json
{
  "name": "ABC School",
  "address": "123 Main St",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

---

### 2. List Schools (sorted by distance)

* **URL:** `/listSchools?latitude=12.9716&longitude=77.5946`
* **Method:** `GET`

---

## Postman

* A Postman collection is included in the project as `postman_collection.json`
* You can import it into Postman to test the APIs easily

---

## Notes

* Make sure your MySQL server is running
* Don’t forget to add your `.env` file (it is not included in the GitHub repository)

---
