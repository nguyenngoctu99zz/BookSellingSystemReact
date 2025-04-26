import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/ExploreButton.css';

const ExploreKnowledgeButton = () => {
  const navigate = useNavigate();

  return (
    <div className="explore-section py-5">
      <div className="container text-center">
        <h2 className="explore-title mb-3">Embark on a Journey of Knowledge</h2>
        <p className="explore-subtitle text-muted mb-4">Expand your horizons with our curated collection</p>
        <button 
          className="btn btn-primary btn-explore" 
          onClick={() => navigate('/explore')}
        >
          Explore the World of Knowledge
        </button>
      </div>
    </div>
  );
};

export default ExploreKnowledgeButton;
