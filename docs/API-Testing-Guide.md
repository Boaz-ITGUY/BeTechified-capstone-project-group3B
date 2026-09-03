# Expense Tracker API — Testing Guide

## Group 3B

This document provides a testing guide for the Expense Tracker API developed by Group 3B. The API was tested using Postman to verify authentication, category management, and expense CRUD operations.

---

## 1. Base URL

When running the API locally:

`http://localhost:5000`

---

## 2. Authentication Testing

Authentication is required before accessing protected resources.

### Register User

**Method:** POST

**Endpoint:**

`/api/auth/register`

**Purpose:** Creates a new user account.

**Sample request:**

```json
{
  "name": "Group 3B Tester",
  "email": "group3b.tester@example.com",
  "password": "Password123"
}
```
