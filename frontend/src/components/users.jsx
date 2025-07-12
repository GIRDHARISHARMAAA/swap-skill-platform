import React from 'react';

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    profilePhoto: 'https://i.pravatar.cc/150?img=1',
    offeredSkills: ['Guitar', 'Chess'],
    wantedSkills: ['Java', 'Python', 'AI/ML'],
    rating: 4,
  },
  {
    id: 2,
    name: 'Bob Smith',
    profilePhoto: 'https://i.pravatar.cc/150?img=2',
    offeredSkills: ['Photoshop', 'Excel'],
    wantedSkills: ['Yoga', 'Public Speaking'],
    rating: 5,
  },
  {
    id: 3,
    name: 'Carol Lee',
    profilePhoto: 'https://i.pravatar.cc/150?img=3',
    offeredSkills: ['Cooking', 'Photography'],
    wantedSkills: ['React', 'Node.js'],
    rating: 3,
  },
];

const UserCardsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-pink-100 to-blue-200 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">User Skill Cards</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition transform duration-300"
          >
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md mb-4"
            />
            <h2 className="text-xl font-bold text-blue-800 mb-2">{user.name}</h2>

            <div className="w-full mb-3">
              <h3 className="text-blue-700 font-semibold">Offered Skills</h3>
              <ul className="list-disc list-inside ml-2 text-gray-700">
                {user.offeredSkills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="w-full mb-3">
              <h3 className="text-blue-700 font-semibold">Wanted Skills</h3>
              <ul className="list-disc list-inside ml-2 text-gray-700">
                {user.wantedSkills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="flex mt-2">
              {[...Array(5)].map((_, idx) => (
                <span
                  key={idx}
                  className={`text-xl ${idx < user.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCardsPage;
