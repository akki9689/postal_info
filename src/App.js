
import React, { useState } from 'react';

function App() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postalData, setPostalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleChange = (e) => {
    setPincode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || !(/^\d+$/.test(pincode))) {
      setError('Pincode must be a 6-digit number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === 'Error') {
        setError(data[0].Message);
      } else {
        setPostalData(data[0].PostOffice);
        setFilteredData(data[0].PostOffice);
      }
    } catch (error) {
      setError('An error occurred while fetching data. Please try again later.');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value.toLowerCase();
    const filteredResults = postalData.filter(post => post.Name.toLowerCase().includes(filterValue));
    setFilteredData(filteredResults);
    if (filterValue !== '' && filteredResults.length === 0) {
      setError("Couldn't find the postal data you're looking for...");
    } else {
      setError('');
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label className='pintext' htmlFor="pincode">Enter Pincode</label>
        <br />
        <input type="text" id="pincode1" value={pincode} onChange={handleChange} maxLength="6" pattern="\d*" title="Please enter a 6-digit pincode" required />
        <br />
        <button  type="submit">Lookup</button>
      </form>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {postalData.length > 0 &&
        <div>
          <input id='flbypo' type="text" placeholder="Filter by post office name" onChange={handleFilter} />
          <ul  >
            {filteredData.map((post, index) => (
              <li key={index}>
                {post.Name}, {post.Pincode}, {post.District}, {post.State}
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
}

export default App;