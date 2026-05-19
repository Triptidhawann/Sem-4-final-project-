const Alert = require('../models/Alert');

const evaluateResource = async (hospital, resourceType, value, criticalThresh, highThresh) => {
    let severity = 'Stable';
    if (value <= criticalThresh) severity = 'Critical';
    else if (value <= highThresh) severity = 'High';

    const query = { hospitalId: hospital._id, resourceType, isResolved: false };

    if (severity === 'Stable') {
        // Resolve any existing active alerts for this resource
        await Alert.updateMany(query, { $set: { isResolved: true } });
        return severity;
    }

    // Message mapping
    let message = '';
    if (severity === 'Critical') {
        message = `${hospital.name} ${resourceType} shortage detected. Immediate assistance required.`;
    } else {
        message = `${hospital.name} ${resourceType} inventory below recommended threshold.`;
    }

    // Check if there is already an active alert for this resource
    const existingAlert = await Alert.findOne(query);

    if (existingAlert) {
        // Update existing alert if severity changed or message changed
        if (existingAlert.severity !== severity) {
            existingAlert.severity = severity;
            existingAlert.message = message;
            await existingAlert.save();
        }
    } else {
        // Create new alert
        await Alert.create({
            hospitalId: hospital._id,
            hospitalName: hospital.name,
            severity,
            message,
            resourceType
        });
    }

    return severity;
};

/**
 * Recalculates the hospital status and generates alerts based on thresholds
 * @param {Object} hospital The mongoose hospital document
 */
const runAlertEngine = async (hospital) => {
    const severities = [];
    
    // Evaluate Oxygen
    severities.push(await evaluateResource(hospital, 'Oxygen', hospital.oxygen, 30, 50));
    // Evaluate ICU Beds
    severities.push(await evaluateResource(hospital, 'ICU Beds', hospital.beds, 20, 50));
    // Evaluate Blood Units
    severities.push(await evaluateResource(hospital, 'Blood Units', hospital.bloodUnits, 40, 80));
    // Evaluate Ventilators
    severities.push(await evaluateResource(hospital, 'Ventilators', hospital.ventilators, 10, 25));

    // Update hospital status based on worst severity
    if (severities.includes('Critical')) hospital.status = 'Critical';
    else if (severities.includes('High')) hospital.status = 'High';
    else if (severities.includes('Moderate')) hospital.status = 'Moderate';
    else hospital.status = 'Stable';

    // Note: We expect the caller to do `await hospital.save()` if they want to persist the status, 
    // or this might be called right before `save()`.
};

module.exports = { runAlertEngine };
