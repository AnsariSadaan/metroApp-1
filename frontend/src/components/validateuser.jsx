import React, { useState, useEffect } from 'react';

const ValidateTicketSection = () => {
    const [selectedLine, setSelectedLine] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [ticketToken, setTicketToken] = useState('');
    const [stations, setStations] = useState([]);
    const [validationMessage, setValidationMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const metroData = [
        {
            line: "Line 1",
            stations: [
                { name: "Versova", distanceFromStart: 0 },
                { name: "D N Nagar", distanceFromStart: 1.5 },
                { name: "Azad Nagar", distanceFromStart: 3.0 },
                { name: "Andheri", distanceFromStart: 5.0 },
                { name: "Ghatkopar", distanceFromStart: 11.4 },
            ],
        },
        {
            line: "Line 2A",
            stations: [
                { name: "Dahisar East", distanceFromStart: 0 },
                { name: "Anand Nagar", distanceFromStart: 2.0 },
                { name: "Borivali West", distanceFromStart: 5.0 },
            ],
        },
    ];

    useEffect(() => {
        const selectedMetro = metroData.find((line) => line.line === selectedLine);
        if (selectedMetro) {
            setStations(selectedMetro.stations);
            setSource('');
            setDestination('');
        } else {
            setStations([]);
            setSource('');
            setDestination('');
        }
    }, [selectedLine]);

    const validateTicket = () => {
        
        if (!source || !destination || !ticketToken) {
            setError('Please fill all fields: Source, Destination, and Ticket Token.');
            setValidationMessage('');
            return;
        }
    
// ----------metro data find karega  for the selected line----------
        const selectedMetro = metroData.find((line) => line.line === selectedLine);
        const stationsOnLine = selectedMetro?.stations || [];
    
// Find the source and destination stations by name
        const sourceStation = stationsOnLine.find(station => station.name === source);
        const destinationStation = stationsOnLine.find(station => station.name === destination);
    
//------------Validate karega source aur destination valid hai ki nahi----------------------
        if (!sourceStation || !destinationStation) {
            setError('Invalid source or destination station.');
            setValidationMessage('');
            return;
        }
    
//--------- Get the indices of source and destination stations on the selected line
        const sourceIndex = stationsOnLine.findIndex(station => station.name === source);
        const destinationIndex = stationsOnLine.findIndex(station => station.name === destination);
    
// ------Ensure that the destination comes after the source station (destination index must be greater than source index)
        if (destinationIndex <= sourceIndex) {
            setError('Invalid route: Destination must be after source.');
            setValidationMessage('');
            return;
        }

       
        const getTicketFromToken = (token) => {
            
            const mockTicket = {
                ticketToken: "TICKET-7687FD40",
                source: "D N Nagar",
                destination: "Andheri",
            };
            return mockTicket;
        };

        const ticket = getTicketFromToken(ticketToken);
    
        if (!ticket || !ticket.source || !ticket.destination) {
            setError('Invalid ticket token: Source or Destination missing.');
            setValidationMessage('');
            return;
        }
    
        const tokenSource = ticket.source;
        const tokenDestination = ticket.destination;
    
// --------------------------Check if the entered source matches or comes after the source in the ticket token----------
        const tokenSourceIndex = stationsOnLine.findIndex(station => station.name === tokenSource);
        if (sourceIndex < tokenSourceIndex) {
            setError('Invalid source station: Entered source is before the source in the ticket token.');
            setValidationMessage('');
            return;
        }
    
//------------- Check karega destination match ho ya destintion se pehle ho------------------------
        const tokenDestinationIndex = stationsOnLine.findIndex(station => station.name === tokenDestination);
        if (destinationIndex > tokenDestinationIndex) {
            setError('Invalid destination station: Entered destination is after the destination in the ticket.');
            setValidationMessage('');
            return;
        }
    
//----------agar sab validation pass hai toh ticket valid hai-------------
        setValidationMessage('Ticket is valid.');
        setError('');
        // setSuccess('Ticket validated successfully.');
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Validate Your Ticket</h1>

            {/* Line Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Line:</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                >
                    <option value="">Select Line</option>
                    {metroData.map((line) => (
                        <option key={line.line} value={line.line}>
                            {line.line}
                        </option>
                    ))}
                </select>
            </div>

            {/* Source Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Source:</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    disabled={stations.length === 0}
                >
                    <option value="">Select Source</option>
                    {stations.map((station) => (
                        <option key={station.name} value={station.name}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Destination Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Destination:</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={stations.length === 0}
                >
                    <option value="">Select Destination</option>
                    {stations.map((station) => (
                        <option key={station.name} value={station.name}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ticket Token Input */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ticket Token:</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={ticketToken}
                    onChange={(e) => setTicketToken(e.target.value)}
                    placeholder="Enter Ticket Token"
                />
            </div>

            {/* Validate Ticket Button */}
            <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                onClick={validateTicket}
            >
                Validate Ticket
            </button>

            {/* Display Validation Results */}
            {validationMessage && <p className="mt-4 text-green-600">{validationMessage}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {success && <p className="mt-4 text-green-500">{success}</p>}
        </div>
    );
};

export default ValidateTicketSection;






