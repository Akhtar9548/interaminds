import React, { useState, useEffect } from 'react';
import "./DonationScreen.css";

interface Donation {
  id: number;
  name: string;
  amount: number;
  date: string;
}

const DonationTracker = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [newDonation, setNewDonation] = useState({ name: '', amount: 0, date: new Date().toISOString().split('T')[0] });
  const [id, setId] = useState(1);
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/donations')
      .then(response => response.json())
      .then(data => setDonations(data))
      .catch(error => console.error('Error fetching donations:', error));
  }, []);
  const handleAddDonation = () => {
    if (newDonation.name && newDonation.amount > 0) {
      fetch('http://127.0.0.1:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDonation),
      })
        .then(response => response.json())
        .then(data => {
          setDonations([...donations, { id, ...newDonation }]);
          setId(id + 1);
          setNewDonation({ name: '', amount: 0, date: new Date().toISOString().split('T')[0] });
        })
        .catch(error => console.error('Error adding donation:', error));
    }
  };
  const handleDeleteDonation = (donationId: number) => {
    const donationToDelete = donations.find(donation => donation.id === donationId);
    if (donationToDelete) {
      fetch(`http://127.0.0.1:5000/api/donations/{donationToDelete.name}rs`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setDonations(donations.filter(donation => donation.id !== donationId));
          } else {
            console.error('Error deleting donation:', response.statusText);
          }
        })
        .catch(error => console.error('Error deleting donation:', error));
    }
  };

  return (
    <div className="container">
      <h1 className="title">Donation Tracker</h1>
      <form className="flex flex-col gap-4 mb-4">
        <label className="form-group">
          <span className="label">Name</span>
          <input
            type="text"
            value={newDonation.name}
            onChange={e => setNewDonation({ ...newDonation, name: e.target.value })}
            className="input"
          />
        </label>
        <label className="form-group">
          <span className="label">Amount</span>
          <input
            type="number"
            value={newDonation.amount}
            onChange={e => setNewDonation({ ...newDonation, amount: parseInt(e.target.value) })}
            className="input"
          />
        </label>
        <label className="form-group">
          <span className="label">Date</span>
          <input
            type="date"
            value={newDonation.date}
            onChange={e => setNewDonation({ ...newDonation, date: e.target.value })}
            className="input"
          />
        </label>
        <button
          type="button"
          onClick={handleAddDonation}
          className="button button-medium"
        >
          Add Donation
        </button>
      </form>

      <ul className="donation-list">
        {donations.map(donation => (
          <li key={donation.id} className="donation-item">
            <div className="donation-details">{donation.name} - {donation.amount}rs on {donation.date}</div>
            {/* <div className="delete-button-container">
              <button
                type="button"
                onClick={() => handleDeleteDonation(donation.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationTracker;
