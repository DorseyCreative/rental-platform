# Heavy Equipment Rental System - Field Operations API

This document provides comprehensive documentation for the Field Operations API endpoints in the Heavy Equipment Rental Management System.

## Base URL
https://script.google.com/macros/s/AKfycbwpOwckgo7r85AbiTBhmkKrRI28n3r3HdAodxj2ApYeFeVMjCxrxTU3IE2rxAbA6esmhQ/exec

## API Endpoints

### Equipment Endpoints
- `GET ?path=equipment` - List all equipment
- `GET ?path=equipment&id=[ID]` - Get equipment details
- `GET ?path=equipment/maintenance&id=[ID]` - Get maintenance history
- `GET ?path=equipment/availability&id=[ID]` - Check availability
- `POST ?path=equipment/inspect&id=[ID]` - Submit inspection

### Maintenance Endpoints
- `GET ?path=maintenance` - List all maintenance records
- `GET ?path=maintenance&id=[ID]` - Get maintenance details
- `GET ?path=maintenance/queue` - Get pending maintenance
- `POST ?path=maintenance/request` - Submit maintenance request
- `POST ?path=maintenance/parts&id=[ID]` - Log parts used
- `POST ?path=maintenance/complete&id=[ID]` - Complete maintenance

### Delivery Endpoints
- `GET ?path=deliveries` - List all deliveries
- `GET ?path=deliveries&id=[ID]` - Get delivery details
- `POST ?path=deliveries/status&id=[ID]` - Update status
- `POST ?path=deliveries/signature&id=[ID]` - Submit signature
- `POST ?path=deliveries/complete&id=[ID]` - Complete delivery

### Mobile Endpoints
- `GET ?path=mobile/driver&driverId=[ID]` - Driver dashboard
- `GET ?path=mobile/technician&technicianId=[ID]` - Technician dashboard

### Offline Support
- `GET ?path=offline/sync&role=[ROLE]&userId=[ID]` - Get offline data
- `POST ?path=offline/submit` - Submit offline data

### Metrics & Reporting
- `GET ?path=metrics/operations` - Get operations metrics
- `GET ?path=metrics/report` - Generate operations report

## Test Gists
- Basic Endpoints: https://gist.github.com/DorseyCreative/90bb41c3f298d62e12d73934a53b0921
- Mobile Endpoints: https://gist.github.com/DorseyCreative/377f7eb7431b4759832333fc23438c52
- Offline Support: https://gist.github.com/DorseyCreative/de76ebe483ee8ad2534a22e9bbcdd162
- Metrics Endpoints: https://gist.github.com/DorseyCreative/9c5cff797b29fdd560d8ed7de3d40a90

## Implementation Notes
- Uses Google Apps Script and Google Sheets
- Supports offline operation
- Mobile-optimized for field operations
- Comprehensive metrics and reporting
