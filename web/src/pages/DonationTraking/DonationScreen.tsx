import { useState } from 'react';
import "./DonationScreen.css"

interface Donation {
  name: string;
  amount: number;
}

const DonationScreen = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);

  const handleAddDonation = () => {
    if (name && amount > 0) {
      setDonations([...donations, { name, amount }]);
      setName('');
      setAmount(0);
    }
  };

  const handleDeleteDonation = (index: number) => {
    setDonations(donations.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Donation Tracker</h2>
      <form className="flex flex-col mb-4">
        <label className="text-sm font-medium mb-2">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4"
        />
        <label className="text-sm font-medium mb-2">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md mb-4"
        />
        <button
          type="button"
          onClick={handleAddDonation}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Donation
        </button>
      </form>
      <ul className="list-none mb-4">
        {donations.map((donation, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border border-gray-300 rounded-md mb-2"
          >
            <span>
              {donation.name}: {donation.amount}rs
            </span>
            <button
              type="button"
              onClick={() => handleDeleteDonation(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p className="text-sm font-medium">
        Total Donations: {donations.reduce((acc, curr) => acc + curr.amount, 0)}rs
      </p>
    </div>
  );
};

export default DonationScreen;