import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BasicInfoForm() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [location, setLocation] = useState('New York');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [skillsOffered, setSkillsOffered] = useState(['Photoshop', 'Guitar']);
  const [skillsWanted, setSkillsWanted] = useState(['Excel', 'Yoga']);

  const [skillsOfferedInput, setSkillsOfferedInput] = useState('Photoshop, Guitar');
  const [skillsWantedInput, setSkillsWantedInput] = useState('Excel, Yoga');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSkillsOffered(parseSkills(skillsOfferedInput));
    setSkillsWanted(parseSkills(skillsWantedInput));
    setIsEditing(false);
  };

  const parseSkills = (input) => {
    return input
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br w-screen mt-20 from-blue-100 via-pink-100 to-blue-200 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-blue-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
          Basic Info
        </h1>

        {isEditing ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center space-y-2">
                <label className="text-lg font-semibold text-blue-800">Profile Photo</label>
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-300 shadow-md group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                      Upload
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-blue-800 font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 text-black bg-white focus:ring-blue-400 focus:outline-none shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-800 font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 text-black bg-white focus:ring-blue-400 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-medium mb-1">Skills Offered</label>
                <input
                  type="text"
                  value={skillsOfferedInput}
                  onChange={(e) => setSkillsOfferedInput(e.target.value)}
                  placeholder="e.g. Photoshop, Guitar"
                  className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 text-black bg-white focus:ring-blue-400 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-blue-800 font-medium mb-1">Skills Wanted</label>
                <input
                  type="text"
                  value={skillsWantedInput}
                  onChange={(e) => setSkillsWantedInput(e.target.value)}
                  placeholder="e.g. Excel, Yoga"
                  className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 text-black bg-white focus:ring-blue-400 focus:outline-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-black bg-white text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 transition"
              >
                Save Profile
              </button>
            </form>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-4 py-3 rounded-xl bg-gray-400 text-white font-bold shadow-lg hover:bg-gray-500 transition"
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-300 shadow-md">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                      No Photo
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xl font-bold text-blue-800">{name}</p>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-1">Location</h3>
                <p className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm">
                  {location || 'Not specified'}
                </p>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-1">Skills Offered</h3>
                <ul className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm space-y-1">
                  {skillsOffered.length > 0 ? skillsOffered.map((skill, idx) => (
                    <li key={idx}>• {skill}</li>
                  )) : <li className="text-gray-500">None listed</li>}
                </ul>
              </div>

              <div>
                <h3 className="text-blue-800 font-semibold mb-1">Skills Wanted</h3>
                <ul className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm space-y-1">
                  {skillsWanted.length > 0 ? skillsWanted.map((skill, idx) => (
                    <li key={idx}>• {skill}</li>
                  )) : <li className="text-gray-500">None listed</li>}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSkillsOfferedInput(skillsOffered.join(', '));
                  setSkillsWantedInput(skillsWanted.join(', '));
                  setIsEditing(true);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 transition"
              >
                Edit Profile
              </button>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-4 py-3 rounded-xl bg-gray-400 text-white font-bold shadow-lg hover:bg-gray-500 transition"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BasicInfoForm;
