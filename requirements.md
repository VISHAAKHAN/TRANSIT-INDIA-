# Requirements Document: Transit India

## Introduction

Transit India is a national-level, government-grade digital public infrastructure platform designed to provide honest, inclusive bus information services to passengers across India. The system is passenger-first, using existing Electronic Ticketing Machines (ETMs), historical data, and optional sparse GPS to deliver reliable trip availability, predictive arrival windows, and delay transparency without requiring smartphones, internet connectivity, or literacy. The platform prioritizes honesty over false precision, operates without passenger tracking, and provides SMS and IVR as first-class access channels alongside optional web interfaces.

## Glossary

- **Transit_India_System**: The complete digital public infrastructure platform for bus information services
- **ETM**: Electronic Ticketing Machine installed on buses for fare collection and trip logging
- **Passenger**: Any person seeking bus information through any access channel
- **Trip**: A scheduled bus service on a specific route with a unique identifier
- **Stop**: A designated bus boarding/alighting location with a unique identifier
- **Arrival_Window**: A time range (e.g., "15-20 minutes") indicating when a bus is expected at a stop
- **Running_Status**: The operational state of a trip (Running Today, Not Running, Status Not Confirmed, Service Discontinued)
- **Delay_Reason**: A classified explanation for service delays (Heavy traffic, Late departure, Road diversion, Service disruption, Status unknown)
- **Access_Channel**: A method for passengers to access information (SMS, IVR, Web)
- **Control_Room**: Human-operated facility for handling emergency escalations
- **AI_Service**: Background machine learning components for prediction and classification
- **State_Transport_Authority**: Government agency operating bus services in a state
- **Confidence_Level**: A measure of prediction reliability used to determine window width

## Requirements

### Requirement 1: Trip Availability Confirmation

**User Story:** As a passenger, I want to know if a specific bus trip is running today, so that I can decide whether to wait at the stop or seek alternative transport.

#### Acceptance Criteria

1. WHEN an ETM logs in at trip start, THE Transit_India_System SHALL mark the trip status as "Running Today"
2. WHEN a trip has not logged in by its scheduled departure time plus 30 minutes, THE Transit_India_System SHALL mark the trip status as "Status Not Confirmed"
3. WHEN a trip is administratively marked as cancelled, THE Transit_India_System SHALL mark the trip status as "Not Running"
4. WHEN a trip has been permanently discontinued, THE Transit_India_System SHALL mark the trip status as "Service Discontinued"
5. THE Transit_India_System SHALL update trip status without requiring new hardware installation
6. WHEN a passenger queries trip availability, THE Transit_India_System SHALL return exactly one of the four defined status values

### Requirement 2: Predictive Arrival Window Generation

**User Story:** As a passenger, I want to know approximately when my bus will arrive as a time range, so that I can plan my waiting time without being misled by false precision.

#### Acceptance Criteria

1. WHEN generating an arrival prediction, THE Transit_India_System SHALL return a time window (minimum and maximum minutes) and SHALL NOT return an exact ETA
2. WHEN the AI_Service has high confidence in its prediction, THE Transit_India_System SHALL generate a narrow arrival window (e.g., 5-minute range)
3. WHEN the AI_Service has low confidence in its prediction, THE Transit_India_System SHALL generate a wide arrival window (e.g., 15-minute range)
4. WHEN the AI_Service cannot make a reliable prediction, THE Transit_India_System SHALL return "Status Not Confirmed" instead of a speculative window
5. THE Transit_India_System SHALL use historical route data, ETM timestamps, time of day, and optional GPS data as inputs for prediction
6. THE Transit_India_System SHALL NOT depend on continuous GPS availability for generating arrival windows
7. WHEN GPS data is unavailable, THE Transit_India_System SHALL generate arrival windows using historical data and ETM timestamps only

### Requirement 3: AI-Powered Arrival Prediction

**User Story:** As a system operator, I want the system to use machine learning for arrival predictions, so that predictions improve over time while remaining honest about uncertainty.

#### Acceptance Criteria

1. THE AI_Service SHALL use time-series forecasting algorithms to predict arrival times
2. THE AI_Service SHALL use regression models to incorporate multiple input factors (historical data, time of day, ETM timestamps, optional GPS)
3. THE AI_Service SHALL calculate a confidence level for each prediction
4. WHEN the confidence level is below a defined threshold, THE AI_Service SHALL indicate low confidence to the Transit_India_System
5. THE AI_Service SHALL operate as a background service and SHALL NOT interact directly with passengers
6. THE AI_Service SHALL provide auditable decision logs for all predictions

### Requirement 4: Delay Reason Classification

**User Story:** As a passenger, I want to understand why my bus is delayed, so that I can make informed decisions about continuing to wait or seeking alternatives.

#### Acceptance Criteria

1. THE Transit_India_System SHALL classify delays into exactly one of these categories: Heavy traffic, Late departure, Road diversion, Service disruption, Status unknown
2. WHEN multiple delay factors exist, THE Transit_India_System SHALL select the single most significant reason
3. THE Transit_India_System SHALL NOT speculate on delay reasons when data is insufficient
4. WHEN delay reason cannot be determined, THE Transit_India_System SHALL return "Status unknown"
5. THE Transit_India_System SHALL NOT attribute delays to individual staff members or drivers
6. THE AI_Service SHALL use classification algorithms to determine delay reasons from available data

### Requirement 5: SMS-Based Bus Information Service

**User Story:** As a passenger without a smartphone or internet, I want to send an SMS to get bus information, so that I can access the service using basic mobile phones.

#### Acceptance Criteria

1. WHEN a passenger sends an SMS with format "BUS <BusNumber> <StopName>", THE Transit_India_System SHALL parse the bus number and stop name
2. WHEN a passenger sends an SMS with format "BUS <BusNumber>" without a stop name, THE Transit_India_System SHALL return information for the next major stop on the route
3. THE Transit_India_System SHALL respond with: running status, arrival window (if available), delay reason (if applicable), and timestamp
4. THE Transit_India_System SHALL respond to SMS queries within 10 seconds
5. THE Transit_India_System SHALL support SMS queries in English, Hindi, and regional languages using transliteration
6. WHEN the bus number or stop name is invalid, THE Transit_India_System SHALL return a clear error message with guidance
7. THE Transit_India_System SHALL NOT require passenger registration or account creation for SMS queries

### Requirement 6: Voice-Based Bus Information (IVR)

**User Story:** As a passenger who cannot read or write, I want to call a number and use voice or keypad to get bus information, so that I can access the service without literacy requirements.

#### Acceptance Criteria

1. THE Transit_India_System SHALL provide an IVR service accessible via a toll-free or local phone number
2. THE Transit_India_System SHALL support keypad-first navigation with voice as an assistive option
3. THE Transit_India_System SHALL provide prompts in Tamil, Hindi, and English with language selection at call start
4. WHEN a passenger selects a language, THE Transit_India_System SHALL conduct the entire interaction in that language
5. THE Transit_India_System SHALL use short, calm prompts without conversational AI or chatbot behavior
6. THE Transit_India_System SHALL allow passengers to input bus number and stop name via keypad or voice
7. THE Transit_India_System SHALL respond with the same information provided via SMS (running status, arrival window, delay reason, timestamp)
8. THE Transit_India_System SHALL complete IVR interactions within 60 seconds for standard queries

### Requirement 7: Emergency Information Provision

**User Story:** As a passenger in an emergency situation, I want to access bus and route information quickly, so that I can provide accurate details to authorities or helplines.

#### Acceptance Criteria

1. THE Transit_India_System SHALL provide emergency information including: bus number, route identifier, last confirmed stop, and relevant helpline numbers
2. THE Transit_India_System SHALL NOT automatically contact police or emergency services
3. THE Transit_India_System SHALL provide emergency information through SMS, IVR, and web interfaces
4. WHEN a passenger requests emergency information, THE Transit_India_System SHALL respond within 5 seconds
5. THE Transit_India_System SHALL include state-specific helpline numbers in emergency information responses

### Requirement 8: Controlled Safety Escalation

**User Story:** As a passenger experiencing a safety threat, I want to report an emergency to a control room, so that human operators can assess and respond appropriately.

#### Acceptance Criteria

1. THE Transit_India_System SHALL accept safety escalation reports only for: harassment, physical fights, medical emergencies, or threats to life
2. WHEN a safety escalation is submitted, THE Transit_India_System SHALL route it to a human-operated Control_Room and SHALL NOT route it directly to police
3. THE Transit_India_System SHALL require bus number and basic incident category for safety escalations
4. THE Transit_India_System SHALL implement rate limiting to prevent abuse (maximum 3 reports per phone number per day)
5. THE Transit_India_System SHALL maintain audit logs for all safety escalation reports
6. THE Transit_India_System SHALL NOT allow anonymous safety escalation reports
7. WHEN rate limits are exceeded, THE Transit_India_System SHALL reject the report and provide helpline numbers instead

### Requirement 9: Route-Level Service Feedback

**User Story:** As a passenger, I want to provide simple feedback about my bus experience, so that transport authorities can improve service quality.

#### Acceptance Criteria

1. THE Transit_India_System SHALL accept feedback in two categories: "Satisfactory" or "Needs Improvement"
2. THE Transit_India_System SHALL associate feedback with route and time period, not individual drivers or buses
3. THE Transit_India_System SHALL NOT display feedback publicly to passengers
4. THE Transit_India_System SHALL aggregate feedback data for State_Transport_Authority access only
5. THE Transit_India_System SHALL allow feedback submission through SMS, IVR, and web interfaces
6. WHEN feedback is submitted, THE Transit_India_System SHALL confirm receipt without displaying aggregate scores

### Requirement 10: Multi-Channel Access Parity

**User Story:** As a system designer, I want all access channels to provide equivalent information, so that no passenger is disadvantaged by their choice of access method.

#### Acceptance Criteria

1. THE Transit_India_System SHALL provide the same core information (running status, arrival window, delay reason) through SMS, IVR, and web interfaces
2. WHEN a feature is available on one access channel, THE Transit_India_System SHALL provide equivalent functionality on all other channels within the same release cycle
3. THE Transit_India_System SHALL NOT require internet connectivity for SMS or IVR access
4. THE Transit_India_System SHALL NOT require smartphone ownership for any core functionality

### Requirement 11: No Passenger Tracking

**User Story:** As a privacy-conscious passenger, I want to use the service without being tracked, so that my travel patterns remain private.

#### Acceptance Criteria

1. THE Transit_India_System SHALL NOT store passenger location data
2. THE Transit_India_System SHALL NOT create passenger profiles or travel history
3. THE Transit_India_System SHALL NOT require passenger authentication or login for information queries
4. THE Transit_India_System SHALL process queries statelessly without linking multiple queries from the same phone number
5. THE Transit_India_System SHALL store only aggregated, anonymized usage statistics for system improvement

### Requirement 12: ETM Integration Without New Hardware

**User Story:** As a State_Transport_Authority, I want to use existing ETM infrastructure, so that I can deploy the system without capital expenditure on new hardware.

#### Acceptance Criteria

1. THE Transit_India_System SHALL integrate with existing ETM systems through standard data export mechanisms
2. THE Transit_India_System SHALL NOT require installation of new hardware on buses for core functionality
3. WHEN ETMs log trip start, THE Transit_India_System SHALL receive trip status updates
4. WHEN ETMs log ticket sales with stop information, THE Transit_India_System SHALL receive stop-level timestamps
5. THE Transit_India_System SHALL support optional GPS integration without making it mandatory for any feature

### Requirement 13: Multilingual Support

**User Story:** As a passenger who speaks a regional language, I want to access bus information in my preferred language, so that I can understand the information clearly.

#### Acceptance Criteria

1. THE Transit_India_System SHALL support Tamil, Hindi, and English as primary languages
2. THE Transit_India_System SHALL allow language selection at the start of each interaction (SMS, IVR, web)
3. WHEN a language is selected, THE Transit_India_System SHALL provide all responses in that language
4. THE Transit_India_System SHALL support additional regional languages through configuration without code changes
5. THE Transit_India_System SHALL use simple, clear language appropriate for government communication

### Requirement 14: Government-Grade Visual Design (Web Interface)

**User Story:** As a State_Transport_Authority, I want the web interface to reflect government standards, so that passengers recognize it as an official public service.

#### Acceptance Criteria

1. THE Transit_India_System SHALL use white or off-white background colors for the web interface
2. THE Transit_India_System SHALL use navy or indigo as primary colors and muted green as accent colors
3. THE Transit_India_System SHALL NOT use gradients, animations, or live maps in the web interface
4. THE Transit_India_System SHALL NOT display countdown timers or exact ETAs in the web interface
5. THE Transit_India_System SHALL use large, readable text with minimum 16px font size for body text
6. THE Transit_India_System SHALL display language toggle controls prominently on all web pages
7. THE Transit_India_System SHALL NOT require user accounts or login for accessing bus information on the web interface

### Requirement 15: Cloud-Based Infrastructure

**User Story:** As a system administrator, I want the platform to run on cloud infrastructure, so that it can scale nationally and integrate with state systems.

#### Acceptance Criteria

1. THE Transit_India_System SHALL be deployable on AWS or Azure cloud platforms
2. THE Transit_India_System SHALL support horizontal scaling to handle national-level query volumes
3. THE Transit_India_System SHALL integrate with SMS gateways for message delivery
4. THE Transit_India_System SHALL integrate with IVR service providers for voice interactions
5. THE Transit_India_System SHALL maintain 99.5% uptime for core information services
6. THE Transit_India_System SHALL process SMS queries with average response time under 10 seconds
7. THE Transit_India_System SHALL support multi-region deployment for data residency compliance

### Requirement 16: Deterministic and Auditable Decisions

**User Story:** As a system auditor, I want all critical decisions to be deterministic and auditable, so that the system can be verified and trusted by government authorities.

#### Acceptance Criteria

1. THE Transit_India_System SHALL log all trip status changes with timestamps and reasons
2. THE Transit_India_System SHALL log all arrival window predictions with input data and confidence levels
3. THE Transit_India_System SHALL log all delay reason classifications with supporting data
4. THE Transit_India_System SHALL log all safety escalation reports with full audit trails
5. THE Transit_India_System SHALL make logs accessible to authorized State_Transport_Authority personnel
6. THE Transit_India_System SHALL retain audit logs for minimum 90 days

### Requirement 17: Honest Information Over False Precision

**User Story:** As a passenger, I want the system to tell me when it doesn't know something, so that I am not misled by inaccurate information.

#### Acceptance Criteria

1. WHEN the Transit_India_System cannot determine trip status, THE Transit_India_System SHALL return "Status Not Confirmed" instead of guessing
2. WHEN the Transit_India_System cannot predict arrival time reliably, THE Transit_India_System SHALL return "Status Not Confirmed" instead of providing a speculative window
3. WHEN the Transit_India_System cannot determine delay reason, THE Transit_India_System SHALL return "Status unknown" instead of speculating
4. THE Transit_India_System SHALL NOT display exact arrival times or countdown timers
5. THE Transit_India_System SHALL NOT make speculative AI decisions that affect passenger information

### Requirement 18: Data Sources and Integration

**User Story:** As a system architect, I want the system to use multiple data sources intelligently, so that predictions are accurate while remaining honest about limitations.

#### Acceptance Criteria

1. THE Transit_India_System SHALL ingest ETM login events for trip status determination
2. THE Transit_India_System SHALL ingest ETM ticket sale events with stop-level timestamps
3. THE Transit_India_System SHALL ingest historical route and stop-level performance data
4. THE Transit_India_System SHALL ingest optional GPS location data when available
5. WHEN GPS data is unavailable, THE Transit_India_System SHALL continue operating using ETM and historical data
6. THE Transit_India_System SHALL store historical data for minimum 12 months for AI model training
7. THE Transit_India_System SHALL update AI models periodically using accumulated historical data

