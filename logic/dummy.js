const PersonaBuilder = () => {
    const [persona, setPersona] = useState({
      experienceLevel: '',
      targetRole: '',
      background: {
        yearsOfExperience: 0,
        educationLevel: '',
        hasProjects: false,
        hasCertifications: false,
        industries: [],
      },
      strengths: [],
      goals: []
    });
  
    const [recommendations, setRecommendations] = useState(null);
  
    // Predefined options
    const roleCategories = {
      TECHNICAL_ROLES: ['Software Engineer', 'Data Scientist', 'DevOps Engineer'],
      RESEARCH_ROLES: ['Research Scientist', 'Research Assistant', 'PhD Candidate'],
      BUSINESS_ROLES: ['Product Manager', 'Business Analyst', 'Project Manager']
    };
  
    const strengthOptions = [
      'Technical Skills', 'Project Experience', 'Academic Excellence',
      'Leadership', 'Research Publications', 'Industry Knowledge'
    ];
  
    const goalOptions = [
      'Career Transition', 'Industry Switch', 'Senior Position',
      'Research Opportunity', 'First Job', 'Leadership Role'
    ];
  
    const analyzePersona = useCallback(() => {
      let roleCategory = '';
      // Determine role category
      Object.entries(roleCategories).forEach(([category, roles]) => {
        if (roles.includes(persona.targetRole)) {
          roleCategory = category;
        }
      });
  
      // Get section importance from the existing SECTION_IMPORTANCE
      const sectionImportance = {
        TECHNICAL_ROLES: {
          projects: 'high',
          skills: 'high',
          experience: 'medium',
          education: 'medium'
        },
        RESEARCH_ROLES: {
          education: 'high',
          research: 'high',
          publications: 'high',
          skills: 'medium'
        },
        BUSINESS_ROLES: {
          experience: 'high',
          achievements: 'high',
          education: 'medium',
          skills: 'medium'
        }
      }[roleCategory];
  
      // Generate recommendations based on persona
      const recommendations = {
        sectionOrder: [],
        visibilitySuggestions: [],
        contentAdvice: [],
        reasoning: []
      };
  
      // Add section order recommendations
      if (persona.experienceLevel === 'fresher') {
        if (persona.background.hasProjects) {
          recommendations.sectionOrder = ['projects', 'skills', 'education', 'experience'];
          recommendations.reasoning.push('As a fresher with projects, leading with your practical experience will make you stand out');
        } else {
          recommendations.sectionOrder = ['education', 'skills', 'projects', 'experience'];
          recommendations.reasoning.push('Your academic background will be your strongest asset as a fresher');
        }
      } else {
        recommendations.sectionOrder = ['experience', 'skills', 'projects', 'education'];
        recommendations.reasoning.push('Your work experience should be highlighted first to demonstrate your industry expertise');
      }
  
      // Add visibility suggestions
      if (persona.background.hasCertifications) {
        recommendations.visibilitySuggestions.push('Include a certifications section to validate your technical skills');
      }
  
      if (persona.strengths.includes('Research Publications')) {
        recommendations.visibilitySuggestions.push('Add a publications section to showcase your research contributions');
      }
  
      // Add content advice
      if (roleCategory === 'TECHNICAL_ROLES') {
        recommendations.contentAdvice.push('Focus on quantifiable achievements in your projects and experience');
        recommendations.contentAdvice.push('List technical skills with proficiency levels');
      } else if (roleCategory === 'RESEARCH_ROLES') {
        recommendations.contentAdvice.push('Emphasize research methodologies and academic achievements');
        recommendations.contentAdvice.push('Include relevant coursework and thesis details');
      }
  
      setRecommendations(recommendations);
    }, [persona, roleCategories]);