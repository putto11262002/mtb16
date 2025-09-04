# Project Architecture & Design Specification

This document provides a detailed overview of the 16th Military Circle Website's
architecture, including its data model, feature breakdown, access rules, and
site map.

## 1. Features

### 1.1 Public-Facing Features

*   **Home Page:** The primary entry point for visitors, featuring a dynamic
    greeting popup, a section for the latest news and announcements, commanding
    officer profile, and convenient quick links to key areas of the site.
*   **News & Posts:** A dedicated section for displaying articles, updates, and
    blog-style content, allowing for detailed communication and information
    dissemination.
*   **Announcements:** A prominent display area for urgent or important
    messages, designed to capture immediate attention and ensure critical
    information is easily accessible.
*   **Resources:** A repository for downloadable files, such as documents,
    forms, or media, categorized and made publicly accessible for easy retrieval
    by visitors.
*   **Commanders Tree:** A visual and interactive representation of the unit's
    organizational hierarchy, allowing users to understand the chain of command
    and individual roles within the structure.

### 1.2 Admin Features (CMS)

*   **Dashboard:** A centralized administrative interface providing an overview
    of site activity, key metrics, and quick access to content management
    functionalities.
*   **Post Management:** Comprehensive tools for creating, editing, publishing,
    and deleting news articles and posts, including rich-text editing and image
    management capabilities.
*   **Announcement Management:** Tools to create, edit, and delete important
    announcements, with options for setting active/inactive states and
    publication dates.
*   **Resource Management:** Functionality to upload, categorize, manage, and
    set visibility (public or admin-only) for downloadable files, ensuring
    secure and organized access to resources.
*   **Commanders Tree Management:** Tools for administrators to add, edit,
    delete, and reorder nodes within the organizational hierarchy, including
    managing names, positions, and photos.
*   **Greeting Popup Management:** Allows administrators to configure, activate,
    and deactivate the site's greeting popup, including setting its content,
    images, links, and display schedule.
*   **User Management:** Functionality to manage the single admin user account,
    including updating credentials and account status.

## 2. Data Model

This section details the entities, their attributes, and relationships within
the application's database.

### 2.1 Admin User
*   **ID** (UUID): A unique identifier for the admin user, automatically
    generated upon creation.
*   **Email** (String): The unique email address used for login, serving as the
    primary identifier for the admin account.
*   **Password Hash** (String): A securely stored hash of the admin's password,
    ensuring that the actual password is never stored in plain text.
*   **First Name** (String): The given name of the admin user, used for
    personalization and identification within the CMS.
*   **Last Name** (String): The surname of the admin user, complementing the
    first name for full identification.
*   **Active** (Boolean): A flag indicating whether the admin account is
    currently enabled and can be used for login.
*   **Created At** (Timestamp): The date and time when the admin account was
    initially created, automatically recorded.
*   **Updated At** (Timestamp): Date and time of last account update.

### 2.2 Post
*   **ID** (UUID): Unique identifier.
*   **Title** (String): Headline of the post.
*   **Description** (String): Brief summary or excerpt.
*   **Content** (Text): Rich-text or markdown body.
*   **Main Image URL** (String): URL to the primary image in Netlify Blob.
*   **Gallery Image URLs** (Array of Strings): Optional array of additional
    image URLs.
*   **Published At** (Timestamp): Date and time when the post becomes public.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.3 Announcement
*   **ID** (UUID): Unique identifier.
*   **Title** (String): Headline of the announcement.
*   **Content** (Text): Body text.
*   **Attachment File URL** (String, Optional): URL to an attached file in
    Netlify Blob.
*   **Active** (Boolean): True if the announcement is currently displayed.
*   **Published At** (Timestamp): Date and time when the announcement was first
    displayed.
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
*   **Parent Node ID** (UUID, Nullable): Reference to the ID of the superior
    node (null for root nodes).
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
*   **Display Start** (Timestamp, Optional): Date and time to start displaying
    the popup.
*   **Display End** (Timestamp, Optional): Date and time to stop displaying the
    popup.
*   **Created At** (Timestamp): Date and time of creation.
*   **Updated At** (Timestamp): Date and time of last update.

### 2.7 Relationships

This section outlines the key relationships between the entities in the data
model.

*   **Commanders Tree Node (Self-Referencing):** Each `Commanders Tree Node` can
    have a `Parent Node ID` that references another `Commanders Tree Node`. This
    creates a hierarchical structure, with `null` for top-level nodes.
*   **Resource Visibility:** The `Visibility` attribute of a `Resource`
    determines its accessibility (public or admin-only). This is a property of
    the entity itself, not a direct foreign-key relationship to another table.
*   **Greeting Popup Activation:** The `Active` flag and `Display
    Start`/`Display End` timestamps on the `Greeting Popup` entity control its
    display period.

## 3. Access Rules

This section defines who can access and modify different parts of the
application.

### 3.1 Public Access
*   **Read-only access** to all public-facing features: Home Page, News & Posts,
    Announcements, Public Resources, Commanders Tree, and Greeting Popup.
*   No login required.

### 3.2 Admin Access
*   **Full read/write/delete access** to all CMS features: Post Management,
    Announcement Management, Resource Management (including admin-only
    resources), Commanders Tree Management, Greeting Popup Management, and Admin
    User Management.
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
