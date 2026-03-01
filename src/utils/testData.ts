export const member = {
    first: 'QA',
    last: 'Automation',
    phone: '(201) 555-0123',
    email: (globalThis as any).process.env.E2E_EMAIL || 'testa1@gmail.com',
    password: (globalThis as any).process.env.E2E_PASSWORD || 'StrongPass123!'
};
  
export const bookingData = {
    dob: '01-01-1990',
    sexAtBirth: 'Male',
    scanName: 'MRI Scan with Skeletal and Neurological Assessment',
    centerName: 'QA Automation Center',
    time1: '12:01 AM',
    time2: '3:01 AM'
};
