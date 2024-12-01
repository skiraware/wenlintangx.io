# Project Title: E-Shopping Website with Payment and Login Functionality (IERG4210)

## Description
This GitHub repository contains the source code for an E-Shopping website with login and payment functionalities. The website is built using AJAX, PHP, HTML, JavaScript, and CSS.

## Basic Features
The website includes the following main features:
- Main Page
  - Navigation part in the header
  - Category list on the left side
  - User info section with login/logout and change password button below the category list
  - Shopping cart in the upper right with a hover to show
  - Product page displaying products and the ability to filter products by category
  - Product detail page
  - Add to cart functionality with the ability to modify items in the shopping cart
  - Checkout with PayPal Sandbox for logged-in users
.

## Login Page
Users can access the login page from the user info panel on the main page. Upon successful login, administrators will be redirected to the admin panel, while regular users will be redirected to the main page.

## Assignment Information
- Student Name: Chan Chung On
- Student ID: 1155157626


## Order Flow
The order flow is different from the marking scheme. Once the PayPal checkout button is clicked on the separate checkout page, the digest of transaction info with the salt and hashed digest is uploaded to _orders_. After a successful payment, the IPN
