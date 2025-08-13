# 🏢 HR Management System 

A comprehensive Angular application for managing employees, attendance, roles, and general settings. This system provides a user-friendly interface for administrators and employees to efficiently handle various HR-related tasks. It includes features for managing employee data, tracking attendance, defining roles and permissions, and configuring general application settings.

## 🚀 Key Features

- **User Authentication:** Secure login functionality with role-based access control. 🔐
- **Dashboard:** Displays key metrics related to employees, such as total count, department distribution, and attendance. 📊
- **Employee Management:** CRUD operations for employee records, including adding, viewing, editing, and deleting employee information. 🧑‍💼
- **Attendance Tracking:** Manages employee attendance records, allowing for filtering, pagination, and export. 📅
- **Role Management:** Defines roles and permissions for different users, controlling access to specific features. 🛡️
- **General Settings:** Configures application-wide settings such as overtime pay, deduction rates, and holiday dates. ⚙️
- **Reporting:** Generates reports on employee data and attendance. 📈
- **Access Control:** Protects routes based on user authentication and authorization. 🚦
- **Lazy Loading:** Improves initial load time by lazily loading components. ⏳
- **Toast Notifications:** Provides user feedback through toast notifications. 💬

## 🛠️ Tech Stack

- **Frontend:**
    - Angular 17+ 🅰️
    - TypeScript 📜
    - HTML5 🌐
    - CSS3 🎨
    - ngx-bootstrap (Datepicker, Timepicker) 📅
    - ngx-toastr 🔔

- **Build Tools:**
    - Angular CLI 💻
    - npm / yarn 📦
- **Other:**
    - SweetAlert2 (for confirmation dialogs) ⚠️
    - RxJS (for reactive programming) 🔄

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher) ⚙️
- npm (v8 or higher) or yarn 📦
- Angular CLI (v17 or higher) 🅰️

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### Running Locally

1.  Start the development server:

    ```bash
    ng serve
    ```

2.  Open your browser and navigate to `http://localhost:4200/`. 🌐

## 📂 Project Structure

```
HRManagementSystem/
├── src/
│   ├── app/
│   │   ├── components/                                          # All UI components
│   │   │   ├── AccessDenied/                                    # Access Denied page
│   │   │   │   └── access-denied.component.ts
│   │   │   ├── AttendancePage/
│   │   │   │   ├── Attendance/
│   │   │   │   │   └── Attendance.component.ts
│   │   │   │   └── manageAttendance/
│   │   │   │       └── manageAttendance.component.ts
│   │   │   ├── dashboard-view/
│   │   │   │   └── dashboard-view.component.ts
│   │   │   ├── edit-official-holiday/
│   │   │   │   └── edit-official-holiday.component.ts
│   │   │   ├── EmployeesPage/
│   │   │   │   └── employee-dashboard/
│   │   │   │       └── employee-dashboard.component.ts
│   │   │   ├── general-setting/
│   │   │   │   └── general-setting.component.ts
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   ├── official-holiday/
│   │   │   │   └── official-holiday.component.ts
│   │   │   ├── RolesPage/
│   │   │   │   ├── role-add/
│   │   │   │   │   └── role-add.component.ts
│   │   │   │   └── role-management/
│   │   │   │       └── role-management.component.ts
│   │   │   └── not-found/                                       # 404 page
│   │   │       └── not-found.component.ts
│   │   ├── layout/
│   │   │   └── dashboard/
│   │   │       └── dashboard.component.ts
│   │   ├── guards/                                              # Route guards
│   │   │   └── auth.guard.ts
│   │   ├── models/                                              # Interfaces & models
│   │   │   └── ... (IAttendance, IEmployee, IDashboard, IHoliday, IPermission, IRole etc.)
│   │   ├── services/                                            # API services
│   │   │   ├── Attendance.service.ts
│   │   │   ├── Auth.service.ts
│   │   │   ├── Dashboard.service.ts
│   │   │   ├── Employee.service.ts
│   │   │   ├── Export.service.ts
│   │   │   ├── Holiday.service.ts
│   │   │   ├── Permission.service.ts
│   │   │   ├── Report.service.ts
│   │   │   ├── Role.service.ts
│   │   │   └── Toastr.service.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── ...
```

## 📸 Screenshots
### Dashboard Overview
![Dashboard View](https://drive.google.com/uc?export=view&id=1sQxWK_FC2zIt-kKbMmmCWO6DwnIeF4_o)

### Roles Page
![Roles Page](https://drive.google.com/uc?export=view&id=1cIn_CBIA7TO_rEMCiAlYWGJUrk94_uIc)

### Users List Page
![Users Page](https://drive.google.com/uc?export=view&id=1orB2bUqJk43VB-FUE59rwetjd-3Gmyia)

### Employee List Page
![Employee List](https://drive.google.com/uc?export=view&id=1I14UlOaRx8HtDQtes2qqtuyoMAY3vt1_)

### Attendance Page
![Attendance Page](https://drive.google.com/uc?export=view&id=1jq7fgArijh6CvBX069QNHdn59HyST2xD)

### Salary Report Page
![Report Page](https://drive.google.com/uc?export=view&id=1XSXpwRVkCaO04bMnhJgYMCcsCvfIFDK8)

#### Responsive Example
![Attendance Mobile View](https://drive.google.com/uc?export=view&id=17cRZobedaaB77Nujsv7dKJW5aNVFJgJd)
