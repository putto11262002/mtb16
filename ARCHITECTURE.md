# Project Architecture & Design Specification

This document provides a detailed overview of the 16th Military Circle Website's architecture, including its data model, feature breakdown, access rules, and site map.

## 1. Features

### 1.1 Public-Facing Features

*   **Home Page:** Landing page with a greeting popup, latest news/announcements, and quick links.
*   **News & Posts:** Displays articles and updates.
*   **Announcements:** Shows important messages.
*   **Resources:** Provides downloadable files (publicly accessible).
*   **Commanders Tree:** Visual representation of the unit's hierarchy.

### 1.2 Admin Features (CMS)

*   **Dashboard:** Overview of site activity.
*   **Post Management:** Create, edit, delete news and articles.
*   **Announcement Management:** Create, edit, delete announcements.
*   **Resource Management:** Upload, manage, and set visibility for downloadable files.
*   **Commanders Tree Management:** Add, edit, delete, and reorder nodes in the hierarchy.
*   **Greeting Popup Management:** Configure and activate/deactivate the site's greeting popup.
*   **User Management:** Manage the single admin user account.

## 2. Data Model

This section details the entities, their attributes, and relationships within the application's database.

### 2.1 Admin User
*   **ID** (UUID): Unique identifier.
*   **Email** (String): Login identifier.
*   **Password Hash** (String): Securely stored password hash.
*   **First Name** (String): Admin's first name.
*   **Last Name** (String): Admin's last name.
*   **Active** (Boolean): Indicates if the account is enabled.
*   **Created At** (Timestamp): Date and time of account creation.
*   **Updated At** (Timestamp): Date and time of last account update.

### 2.2 Post
*   **ID** (UUID): Unique identifier.
*   **Title** (String): Headline of the post.
*   **Description** (String): Brief summary or excerpt.
*   **Content** (Text): Rich-text or markdown body.
*   **Main Image URL** (String): URL to the primary image in Netlify Blob.
*   **Gallery Image URLs** (Array of Strings): Optional array of additional image URLs.
*   **Published At** (Timestamp): Date and time when the post becomes public.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.3 Announcement
*   **ID** (UUID): Unique identifier.
*   **Title** (String): Headline of the announcement.
*   **Content** (Text): Body text.
*   **Attachment File URL** (String, Optional): URL to an attached file in Netlify Blob.
*   **Active** (Boolean): True if the announcement is currently displayed.
*   **Published At** (Timestamp): Date and time when the announcement was first displayed.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.4 Resource
*   **ID** (UUID): Unique identifier.
*   **Title** (String): Name of the resource.
*   **Description** (String): Brief explanation of the file.
*   **File URL** (String): URL to the stored file in Netlify Blob.
*   **File Size** (Number): Size of the file in bytes.
*   **MIME Type** (String): MIME type of the file (e.g., 'application/pdf').
*   **Visibility** (Enum: 'public', 'admin-only'): Controls access to the file.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.5 Commanders Tree Node
*   **ID** (UUID): Unique identifier.
*   **Name** (String): Person's full name.
*   **Position Title** (String): Rank or role.
*   **Parent Node ID** (UUID, Nullable): Reference to the ID of the superior node (null for root nodes).
*   **Order** (Number): Numeric value for display order among siblings.
*   **Photo URL** (String, Optional): URL to the person's photo in Netlify Blob.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.6 Greeting Popup
*   **ID** (UUID): Unique identifier.
*   **Title** (String): Heading for the popup.
*   **Message** (Text): Body text of the popup.
*   **Image URL** (String, Optional): URL to an image displayed in the popup.
*   **Link URL** (String, Optional): URL for a button or hyperlink.
*   **Active** (Boolean): True if the popup is currently shown.
*   **Display Start** (Timestamp, Optional): Date and time to start displaying the popup.
*   **Display End** (Timestamp, Optional): Date and time to stop displaying the popup.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.7 Relationships

This section outlines the key relationships between the entities in the data model.

*   **Commanders Tree Node (Self-Referencing):** Each `Commanders Tree Node` can have a `Parent Node ID` that references another `Commanders Tree Node`. This creates a hierarchical structure, with `null` for top-level nodes.
*   **Resource Visibility:** The `Visibility` attribute of a `Resource` determines its accessibility (public or admin-only). This is a property of the entity itself, not a direct foreign-key relationship to another table.
*   **Greeting Popup Activation:** The `Active` flag and `Display Start`/`Display End` timestamps on the `Greeting Popup` entity control its display period.

## 3. Access Rules

This section defines who can access and modify different parts of the application.

### 3.1 Public Access
*   **Read-only access** to all public-facing features: Home Page, News & Posts, Announcements, Public Resources, Commanders Tree, and Greeting Popup.
*   No login required.

### 3.2 Admin Access
*   **Full read/write/delete access** to all CMS features: Post Management, Announcement Management, Resource Management (including admin-only resources), Commanders Tree Management, Greeting Popup Management, and Admin User Management.
*   Requires authentication via email and password.

## 4. Site Map / Page Hierarchy

This section outlines the main pages and their relationships within the website.

### 4.1 Public Site Map
*   `/` (Home Page)
*   `/news` (News & Posts Listing)
    *   `/news/[slug]` (Individual Post Page)
*   `/announcements` (Announcements Listing)
*   `/resources` (Resources Listing)
*   `/commanders-tree` (Commanders Tree Page)

### 4.2 Admin Site Map
*   `/admin/login` (Admin Login Page)
*   `/admin/dashboard` (Admin Dashboard)
*   `/admin/posts` (Post Management)
    *   `/admin/posts/new` (Create New Post)
    *   `/admin/posts/[id]/edit` (Edit Post)
*   `/admin/announcements` (Announcement Management)
    *   `/admin/announcements/new` (Create New Announcement)
    *   `/admin/announcements/[id]/edit` (Edit Announcement)
*   `/admin/resources` (Resource Management)
    *   `/admin/resources/new` (Upload New Resource)
    *   `/admin/resources/[id]/edit` (Edit Resource)
*   `/admin/commanders-tree` (Commanders Tree Management)
*   `/admin/greeting-popup` (Greeting Popup Management)
*   `/admin/profile` (Admin User Profile Management)
