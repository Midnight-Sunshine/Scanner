import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Import the custom CSS file

const App = () => {
    const [clientData, setClientData] = useState({
        surname: '',
        name: '',
        country: '',
        nationality: '',
        birth_date: '',
        expiry_date: '',
        sex: '',
        document_type: '',
        document_number: '',
        optional_data: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScan = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:5000/scan');
            const data = response.data;

            const currentYear = new Date().getFullYear() % 100;

            const correctFormatDate = (date, type) => {
                if (date.length === 6) {
                    const day = date.slice(4, 6);
                    const month = date.slice(2, 4);
                    const yearLastTwoDigits = parseInt(date.slice(0, 2), 10);

                    let year;
                    if (type === 'birth') {
                        year = yearLastTwoDigits > currentYear ? `19${yearLastTwoDigits}` : `20${yearLastTwoDigits}`;
                    } else if (type === 'expiry') {
                        year = yearLastTwoDigits > currentYear ? `20${yearLastTwoDigits}` : `21${yearLastTwoDigits}`;
                    }

                    return `${year}-${month}-${day}`;
                }
                return date;
            };

            setClientData({
                ...data,
                birth_date: correctFormatDate(data.birth_date, 'birth'),
                expiry_date: correctFormatDate(data.expiry_date, 'expiry')
            });
        } catch (error) {
            setError('Error scanning MRZ code. Please try again.');
            console.error("Error scanning MRZ code:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: '600px', backgroundColor: '#f0f0f0', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                <h1 className="text-center mb-4">Client Creation Form</h1>
                <button 
                    className="btn btn-custom btn-block mb-4" 
                    onClick={handleScan} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Scanning...' : 'Scan MRZ Code'}
                </button>
                {error && <p className="text-danger text-center">{error}</p>}
                <form>
                    <div className="form-group">
                        <label>Surname:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="surname"
                            value={clientData.surname} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="name"
                            value={clientData.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Country:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="country"
                            value={clientData.country} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Nationality:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="nationality"
                            value={clientData.nationality} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Birth Date:</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            name="birth_date"
                            value={clientData.birth_date} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            name="expiry_date"
                            value={clientData.expiry_date} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Sex:</label>
                        <select 
                            className="form-control" 
                            name="sex"
                            value={clientData.sex} 
                            onChange={handleChange} 
                        >
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Document Type:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="document_type"
                            value={clientData.document_type} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Document Number:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="document_number"
                            value={clientData.document_number} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Optional Data:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="optional_data"
                            value={clientData.optional_data} 
                            onChange={handleChange} 
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
