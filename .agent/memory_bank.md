# 🏛 MEMORY BANK - SMARTRETAIL Warranty System v2.1

## 1. 📋 Project Overview
*   **Purpose:** Centralized system to manage and lookup product warranty information for SMARTRETAIL.
*   **Core Objective:** Provide a seamless lookup experience via Serial Number/Phone/Tax Code for customers and a robust management dashboard for technicians.
*   **Key Upgrade (v2.0):** Project/Dealer support and QR Code-based self-activation.
*   **Key Upgrade (v2.1):** Software License integration with Master-Member management.

## 2. 🏗 System Architecture
*   **Stack:** Node.js (Express) + MongoDB (Atlas) + React (Vite) + TailwindCSS.
*   **Architecture Pattern:** Service-Controller-Route (Backend) | Page-Component-API (Frontend).
*   **Data Strategy:**
    *   **Hardware:** Indivual records per serial number for all customer types (Retail, Project, Dealer).
    *   **Software:** Integrated License info linked to hardware serials.
    *   **Master-Member Concept:** In a project batch, the first serial number acts as the **Master**. Only the Master record displays full login credentials (Account/Password). Member records display hardware info and a pointer to the Master device for software management.

## 3. 🛠 Technical Implementation (v2.1)
### Backend Structure:
*   **Schema (`Warranty.js`)**: Includes `hasSoftware`, `softwareInfo` (Account, Password, PlayerId, LicenseType, LicenseStatus, MasterSerial, SoftwareEndDate).
*   **Helper (`softwareHelper.js`)**: Logic for license end date calculation, license status evaluation, and masking sensitive data for member devices.
*   **Controller (`warrantyController.js`)**: Handles search logic with conditional masking based on the searched Serial vs Master Serial.
*   **Service (`warrantyService.js`)**: Bulk import/create logic that preserves shared software info across multiple individual records.

### Frontend Features:
*   **Public Search (`Home.jsx`)**: Displays detailed hardware status and conditional Software License cards (Glassmorphism design).
*   **QR Activation (`Activation.jsx`)**: Allows customers to view and activate their hardware warranty and see associated software licenses before confirming.
*   **Admin Tools (`AdminDashboard.jsx`)**: Bulk management, Excel import, and QR generation.

## 4. ⚡ Core Functionality
*   **Multi-Attribute Search:** Lookup by SN + (Phone or Tax Code).
*   **Status Indicators:** Active (Green), Pending (Amber), Expired (Red).
*   **Software Indicators:** Lifetime vs Limited licenses with "Days Remaining" counters.
*   **Bulk Import:** Smart Excel parsing that handles multiple serial numbers and automatic master designation.

## 5. 🗺 Roadmap & Progress
*   [x] Core Warranty System (v1.0)
*   [x] Project Support & QR Activation (v2.0)
*   [x] Software License Integration (v2.1)
*   [ ] Admin Authentication & RBAC
*   [ ] Exportable Reports (Excel/PDF)
*   [ ] Multi-language Support (EN/VN)

---
*Last Updated: 2024-12-31*
