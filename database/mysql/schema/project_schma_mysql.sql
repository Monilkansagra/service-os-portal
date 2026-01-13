-- =========================
-- DATABASE
-- =========================
CREATE DATABASE IF NOT EXISTS service_management_db;
USE service_management_db;

-- =========================
-- ROLES
-- =========================
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST STATUS
-- =========================
CREATE TABLE service_request_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL UNIQUE,
    sequence INT NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    is_allowed_for_technician BOOLEAN DEFAULT TRUE,
    description VARCHAR(250)
) ENGINE=InnoDB;

-- =========================
-- SERVICE DEPARTMENT
-- =========================
CREATE TABLE service_department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(150) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- =========================
-- SERVICE DEPARTMENT PERSON
-- =========================
CREATE TABLE service_department_person (
    dept_person_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_id INT NOT NULL,
    user_id INT NOT NULL,
    is_hod BOOLEAN DEFAULT FALSE,
    active_from DATE NOT NULL,
    active_to DATE,
    CONSTRAINT fk_dept_person_dept
        FOREIGN KEY (dept_id)
        REFERENCES service_department(dept_id),
    CONSTRAINT fk_dept_person_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB;

-- =========================
-- SERVICE TYPE
-- =========================
CREATE TABLE service_type (
    service_type_id INT AUTO_INCREMENT PRIMARY KEY,
    service_type_name VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST TYPE
-- =========================
CREATE TABLE service_request_type (
    request_type_id INT AUTO_INCREMENT PRIMARY KEY,
    service_type_id INT NOT NULL,
    dept_id INT NOT NULL,
    request_type_name VARCHAR(150) NOT NULL,
    default_priority VARCHAR(50),
    CONSTRAINT fk_request_type_service
        FOREIGN KEY (service_type_id)
        REFERENCES service_type(service_type_id),
    CONSTRAINT fk_request_type_dept
        FOREIGN KEY (dept_id)
        REFERENCES service_department(dept_id)
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST TYPE PERSON
-- =========================
CREATE TABLE service_request_type_person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_type_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_request_type_person_type
        FOREIGN KEY (request_type_id)
        REFERENCES service_request_type(request_type_id),
    CONSTRAINT fk_request_type_person_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST
-- =========================
CREATE TABLE service_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    request_no VARCHAR(50) NOT NULL UNIQUE,
    request_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_type_id INT NOT NULL,
    request_title VARCHAR(250) NOT NULL,
    request_description TEXT NOT NULL,
    status_id INT NOT NULL,
    priority_level VARCHAR(50),
    assigned_to_user_id INT,
    created_by_user_id INT NOT NULL,
    CONSTRAINT fk_request_type
        FOREIGN KEY (request_type_id)
        REFERENCES service_request_type(request_type_id),
    CONSTRAINT fk_request_status
        FOREIGN KEY (status_id)
        REFERENCES service_request_status(status_id),
    CONSTRAINT fk_request_assigned_user
        FOREIGN KEY (assigned_to_user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_request_created_user
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST REPLY
-- =========================
CREATE TABLE service_request_reply (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    replied_by_user_id INT,
    reply_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_text TEXT,
    status_id INT NOT NULL,
    CONSTRAINT fk_reply_request
        FOREIGN KEY (request_id)
        REFERENCES service_request(request_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reply_user
        FOREIGN KEY (replied_by_user_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_reply_status
        FOREIGN KEY (status_id)
        REFERENCES service_request_status(status_id)
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST ATTACHMENT
-- =========================
CREATE TABLE service_request_attachment (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    file_path VARCHAR(300) NOT NULL,
    original_file_name VARCHAR(250),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_request
        FOREIGN KEY (request_id)
        REFERENCES service_request(request_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- SERVICE REQUEST APPROVAL
-- =========================
CREATE TABLE service_request_approval (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    approved_by_user_id INT,
    approval_status VARCHAR(50),
    approval_datetime TIMESTAMP,
    remarks TEXT,
    CONSTRAINT fk_approval_request
        FOREIGN KEY (request_id)
        REFERENCES service_request(request_id),
    CONSTRAINT fk_approval_user
        FOREIGN KEY (approved_by_user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 1. Service Request Status Master 
-- Adding System Name and CSS Class for Dashboard UI
ALTER TABLE service_request_status 
ADD COLUMN status_system_name VARCHAR(100) NOT NULL AFTER status_name,
ADD COLUMN status_css_class VARCHAR(250) AFTER description,
ADD COLUMN is_no_further_action_required BIT DEFAULT 0 AFTER is_allowed_for_technician,
ADD COLUMN user_id INT NOT NULL,
ADD COLUMN created DATETIME NOT NULL,
ADD COLUMN modified DATETIME NOT NULL;

-- 2. Service Department Master [cite: 40]
-- Adding Campus info and Email tracking
ALTER TABLE service_department 
ADD COLUMN campus_id INT NOT NULL AFTER dept_name,
ADD COLUMN cc_email_to_csv VARCHAR(250) AFTER description,
ADD COLUMN is_request_title_disable BIT DEFAULT 0,
ADD COLUMN user_id INT NOT NULL,
ADD COLUMN created DATETIME NOT NULL,
ADD COLUMN modified DATETIME NOT NULL;

-- 3. Service Type Master [cite: 42]
-- Adding Role-based visibility and sequence
ALTER TABLE service_type 
ADD COLUMN description VARCHAR(250) AFTER service_type_name,
ADD COLUMN sequence DECIMAL(18,2),
ADD COLUMN is_for_staff BIT DEFAULT 1,
ADD COLUMN is_for_student BIT DEFAULT 1,
ADD COLUMN user_id INT NOT NULL,
ADD COLUMN created DATETIME NOT NULL,
ADD COLUMN modified DATETIME NOT NULL;

-- 4. Service Request Type Master [cite: 43]
-- Adding critical counters for Dashboard performance
ALTER TABLE service_request_type 
ADD COLUMN description VARCHAR(250) AFTER request_type_name,
ADD COLUMN sequence DECIMAL(18,2),
ADD COLUMN request_total INT DEFAULT 0,
ADD COLUMN request_pending INT DEFAULT 0,
ADD COLUMN request_closed INT DEFAULT 0,
ADD COLUMN request_cancelled INT DEFAULT 0,
ADD COLUMN is_visible_resource BIT DEFAULT 0,
ADD COLUMN reminder_days_after_assignment INT,
ADD COLUMN is_mandatory_resource BIT DEFAULT 0,
ADD COLUMN user_id INT NOT NULL,
ADD COLUMN created DATETIME NOT NULL,
ADD COLUMN modified DATETIME NOT NULL;

-- 5. Service Request (Main Table Updates) 
-- Adding extra attachments and full tracking details
ALTER TABLE service_request 
ADD COLUMN service_request_status_datetime DATETIME AFTER status_id,
ADD COLUMN service_request_status_by_user_id INT,
ADD COLUMN service_request_status_description VARCHAR(500),
ADD COLUMN approval_status_datetime DATETIME,
ADD COLUMN approval_status_by_user_id INT,
ADD COLUMN approval_status_description VARCHAR(250),
ADD COLUMN assigned_datetime DATETIME,
ADD COLUMN assigned_by_user_id INT,
ADD COLUMN assigned_description VARCHAR(250),
ADD COLUMN resource_id INT,
ADD COLUMN on_behalf_of_staff_id INT,
ADD COLUMN student_id INT,
ADD COLUMN attachment_path_2 VARCHAR(250),
ADD COLUMN attachment_path_3 VARCHAR(250),
ADD COLUMN attachment_path_4 VARCHAR(250),
ADD COLUMN attachment_path_5 VARCHAR(250),
ADD COLUMN user_id INT NOT NULL,
ADD COLUMN created DATETIME NOT NULL,
ADD COLUMN modified DATETIME NOT NULL;

-- 6. Service Request Reply [cite: 46]
-- For audit trail of status changes during communication
ALTER TABLE service_request_reply 
ADD COLUMN service_request_status_by_user_id INT NOT NULL,
ADD COLUMN service_request_status_description VARCHAR(250),
ADD COLUMN attachment_file_original_name VARCHAR(250),
ADD COLUMN service_request_type_id INT,
ADD COLUMN student_id INT,
ADD COLUMN user_id INT NOT NULL,
ADD COLUMN created DATETIME NOT NULL,
ADD COLUMN modified DATETIME NOT NULL;
