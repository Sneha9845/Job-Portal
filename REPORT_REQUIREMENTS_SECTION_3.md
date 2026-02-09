
# 3. System Analysis and Requirements

## 3.1 Users

The Job Portal is designed to serve a dual-sided marketplace with two distinct primary user groups. Understanding the specific characteristics, limitations, and goals of these users is critical to the system's design, particularly given the focus on accessibility for the blue-collar workforce.

### 3.1.1 The Unskilled / Semi-Skilled Worker (Candidate)
This user group forms the core of the platform. They are individuals seeking daily wage jobs or manual labor opportunities (e.g., construction handling, cleaning, loading).

*   **Demographics & Characteristics**:
    *   **Technological Proficiency**: Generally low to moderate. Most own low-cost Android smartphones but may struggle with complex navigation, typing, or English interfaces.
    *   **Literacy Levels**: A significant portion may be functionally illiterate or only comfortable reading in their native regional language (Kannada, Hindi, Tamil, Telugu, etc.).
    *   **Connectivity**: Often relies on prepaid mobile data, which can be intermittent or slow (3G/4G).
    *   **Motivation**: High urgency to find immediate employment/earnings. They value speed and direct communication over browsing lengthy applications.

*   **Key Needs**:
    *   **Accessible Interface**: Interfaces that rely heavily on visual cues (icons, colors) rather than text.
    *   **Voice Interactions**: The ability to search for jobs or input their details using voice commands instead of typing.
    *   **Native Language Support**: The entire platform must operate in their local language to be usable.
    *   **Direct Access**: One-click solutions to contact employers or receive job details (e.g., "Click to Call").

*   **System Privileges**:
    *   Can register via OTP (simpler than email/password).
    *   Can view available jobs filtered by their selected skills.
    *   Can receive notifications for assigned jobs.
    *   Can view a simplified dashboard showing their assignment status (e.g., location, salary, reporting time).

### 3.1.2 The Administrator (Office/Recruiter)
This user group consists of the back-office staff or recruitment managers who coordinate the workforce. They are responsible for matching the supply (workers) with the demand (jobs).

*   **Demographics & Characteristics**:
    *   **Technological Proficiency**: High. They are comfortable using desktop browsers, analyzing data tables, and managing complex workflows.
    *   **Workflow**: They handle high volumes of data—registering tens or hundreds of workers and assigning them to various sites daily.
    *   **Motivation**: Efficiency and Accuracy. They need to quickly find available workers in a specific location and ensure they are dispatched correctly.

*   **Key Needs**:
    *   **Bird’s Eye View**: A comprehensive dashboard showing total registered workers, active jobs, and assignments at a glance.
    *   **Data Management**: Tools to manually register workers (who might walk into the office) and verify their details.
    *   **Assignment Controls**: Detailed forms to input specific job instructions (e.g., "Meet Guide Suresh at Main Gate") that are then pushed to the worker.
    *   **Search and Filter**: Advanced filtering capability to find workers based on specific skills (e.g., "Mason" vs. "Helper") or verification status.

*   **System Privileges**:
    *   Full CRUD (Create, Read, Update, Delete) access to Worker and Job databases.
    *   Ability to trigger SMS or system notifications to workers.
    *   Access to analytical views (charts/graphs) of platform performance.

---

## 3.2 Functional Requirements

The functional requirements define the specific behaviors and functions of the Job Portal system. These requirements are derived directly from the user needs outlined above.

### 3.2.1 Authentication and Onboarding Module
*   **FR-01 Phone Number Registration**: The system SHALL allow workers to register using their mobile phone number as the primary unique identifier, preventing duplicate accounts for the same person.
*   **FR-02 OTP Verification**: The system MOUNT verify the ownership of the phone number via a One-Time Password (OTP) sent via SMS to prevent spam registrations.
*   **FR-03 Multilingual Onboarding**: The registration form MUST be dynamically switchable between supported languages (English, Kannada, Hindi, Tamil, Telugu, Marathi / Bengali) without losing entered data.
*   **FR-04 Skill Selection**: The system SHALL provide a predetermined list of skills (e.g., Construction, Cleaning, Driver) represented by both text and visual icons for workers to select during sign-up.

### 3.2.2 Worker Dashboard & Job Search
*   **FR-05 Voice-Enabled Search**: The system SHALL integrate a voice recognition feature (using Web Speech API) allowing workers to speak their query (e.g., "Driver job") in their native language to filter listings.
*   **FR-06 Visual Job Cards**: Job listings MUST be displayed as "Cards" containing essential information (Daily Wage, Location, Role) with minimal text and prominent icons.
*   **FR-07 "Call to Apply" Action**: Instead of a complex resume submission, the system SHALL provide a direct "Call Now" or "Accept Job" button that initiates a phone call to the office or confirms interest.
*   **FR-08 Assignment details view**: Once a job is assigned by an Admin, the worker's dashboard MUST be updated to show the "My Job" view, displaying critical details: Guide Name, Guide Phone Number, Reporting Time, and Location Map Link.

### 3.2.3 Administrative Dashboard
*   **FR-09 Real-time Candidate List**: The Admin dashboard MUST display a real-time list of all registered candidates, with status indicators (Verified/Unverified, Assigned/Available).
*   **FR-10 Job Creation**: Administrators SHALL be able to create new job postings with detailed attributes: Title, Description, Wage, Location, Required Skills, and Number of Openings.
*   **FR-11 Worker Assignment Logic**: The system SHALL allow Admins to "Assign" a specific worker to a specific job. This action should trigger a status change for the worker from "Available" to "Assigned".
*   **FR-12 Manual Worker Management**: Administrators MUST have the ability to manually delete or update worker profiles to handle cases where a worker changes their number or leaves the platform.

### 3.2.4 Notification and Communication System
*   **FR-13 SMS Alerts**: The system SHALL integrate with an SMS gateway to send confirmation messages to workers upon successful registration and when a job is assigned.
*   **FR-14 Cross-Device Sync**: If a User logs in on a new device, the system SHOULD be capable of syncing their status and notifications (e.g., Browser Push Notifications) to ensure they never miss a job alert. 

### 3.2.5 Localization and Accessibility
*   **FR-15 Dynamic Translation**: The system SHALL utilize a `LanguageContext` to instantly translate all UI strings (buttons, labels, error messages) based on the user's selected preference.
*   **FR-16 Visual Aids**: All critical navigation elements MUST be paired with Lucide-React icons to ensure users with zero literacy can still navigate (e.g., a 'House' icon for Home, a 'Phone' icon for Contact).

---

## 3.3 Non-Functional Requirements

Non-functional requirements (NFRs) define the quality attributes of the system, such as usability, reliability, and performance, which are critical for the user experience of this specific demographic.

### 3.3.1 Usability and Accessibility (Priority)
Given the target audience of unskilled workers, usability is the most critical NFR.
*   **NFR-01 Simplicity**: The User Interface (UI) SHALL NOT exceed a maximum of 3 clicks to perform a core action (e.g., viewing a job). Navigation must be flat and linear.
*   **NFR-02 Mobile Responsiveness**: The application MUST be fully responsive and render correctly on entry-level smartphones with screen widths as low as 320px.
*   **NFR-03 Visual Hierarchy**: The design MUST use high-contrast colors and large touch targets (minimum 44x44 pixels) to accommodate users who may be working in outdoor environments with glare.
*   **NFR-04 Zero-Learning Curve**: The system design SHOULD be intuitive enough that a first-time user requires no training. Icons used must be universally recognized symbols.

### 3.3.2 Performance and Reliability
*   **NFR-05 Low Bandwidth Operation**: The application pages SHALL be optimized to load in under 3 seconds on a standardized 3G network connection. This requires aggressive optimization of image assets (SVG/WebP) and code splitting via Next.js.
*   **NFR-06 Offline Gracefulness**: The system SHOULD provide clear visual feedback if the user loses internet connection, rather than showing a generic browser error, preserving the user's trust in the app.
*   **NFR-07 Scalability**: The backend (MongoDB) MUST be capable of handling concurrent read operations during peak morning hours (6:00 AM - 9:00 AM) when workers are actively looking for daily assignments.
*   **NFR-08 Availability**: The system SHALL target 99.9% uptime during business hours, as downtime directly translates to lost wages for the workers.

### 3.3.3 Security and Privacy
*   **NFR-09 Data Minimization**: The system SHALL ONLY collect data essential for job allocation (Name, Phone, Skill, Location). No extraneous personal data (e.g., detailed address history) should be mandatory.
*   **NFR-10 Secure Transmission**: All data exchange between the client and server MUST be encrypted using HTTPS (TLS 1.2 or higher) to protect worker phone numbers from interception.
*   **NFR-11 Admin Access Control**: The Administrative Dashboard MUST be secured behind a robust authentication layer to prevent unauthorized manipulation of job data or worker lists.

### 3.3.4 Maintainability and Compatibility
*   **NFR-12 Browser Compatibility**: The application MUST be compatible with the last 5 versions of major mobile browsers (Chrome for Android, Opera Mini, UC Browser), as workers often use older devices with un-updated software.
*   **NFR-13 Modular Architecture**: The codebase SHOULD follow the component-based architecture of React. This ensures that adding a new language or a new job category in the future does not require a rewrite of the core logic.
