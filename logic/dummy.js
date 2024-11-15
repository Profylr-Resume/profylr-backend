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
  /*
    header , summary , experience, projects , education , skills, certifications, achievements , publications , research , volunteer
*/
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





    RESPONSE 1 :
    const generateResumeRecommendations = (persona) => {
        const recommendations = {
            sections: [],
            sectionOrder: [],
            contentAdvice: [],
            reasoning: []
        };
    
        // Destructure persona
        const { experienceLevel, targetRole, background, strengths, goals } = persona;
    
        // Determine essential sections
        recommendations.sections.push('Header', 'Summary');
    
        // Add sections based on experience level
        if (background.yearsOfExperience > 0 || experienceLevel === 'Intermediate' || experienceLevel === 'Advanced') {
            recommendations.sections.push('Experience');
            recommendations.reasoning.push('Experience is important to demonstrate real-world applications of skills.');
        }
    
        if (background.hasProjects) {
            recommendations.sections.push('Projects');
            recommendations.reasoning.push('Projects showcase applied skills, which are valuable for roles requiring technical or hands-on expertise.');
        }
    
        if (background.educationLevel) {
            recommendations.sections.push('Education');
            recommendations.reasoning.push('Education is foundational, especially for early-career candidates or roles requiring specific degrees.');
        }
    
        if (background.hasCertifications) {
            recommendations.sections.push('Certifications');
            recommendations.reasoning.push('Certifications validate specific technical skills or knowledge areas.');
        }
    
        if (strengths.includes('Research Publications') || targetRole && roleCategories.RESEARCH_ROLES.includes(targetRole)) {
            recommendations.sections.push('Publications', 'Research');
            recommendations.reasoning.push('Publications and research highlight academic and scientific achievements.');
        }
    
        if (strengths.includes('Leadership') || goals.includes('Leadership Role')) {
            recommendations.sections.push('Achievements');
            recommendations.reasoning.push('Achievements highlight leadership and initiative.');
        }
    
        if (background.industries.includes('Non-Profit') || strengths.includes('Volunteer Experience')) {
            recommendations.sections.push('Volunteer');
            recommendations.reasoning.push('Volunteer experience demonstrates well-roundedness and social impact.');
        }
    
        // Add skills section if there are strengths or technical roles
        if (strengthOptions.some((strength) => strengths.includes(strength))) {
            recommendations.sections.push('Skills');
            recommendations.reasoning.push('Skills highlight specific expertise relevant to target roles.');
        }
    
        // Determine section order based on target role and goals
        if (targetRole) {
            if (roleCategories.TECHNICAL_ROLES.includes(targetRole)) {
                recommendations.sectionOrder = ['Header', 'Summary', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications'];
            } else if (roleCategories.RESEARCH_ROLES.includes(targetRole)) {
                recommendations.sectionOrder = ['Header', 'Summary', 'Research', 'Education', 'Publications', 'Skills', 'Achievements'];
            } else if (roleCategories.BUSINESS_ROLES.includes(targetRole)) {
                recommendations.sectionOrder = ['Header', 'Summary', 'Experience', 'Education', 'Skills', 'Achievements'];
            } else {
                recommendations.sectionOrder = ['Header', 'Summary', 'Education', 'Skills', 'Experience'];
            }
        }
    
        // Provide content-specific advice
        if (background.yearsOfExperience > 0) {
            recommendations.contentAdvice.push('Highlight specific accomplishments in past roles that align with the target role.');
        }
    
        if (background.hasProjects) {
            recommendations.contentAdvice.push('Focus on projects that demonstrate technical skills or leadership.');
        }
    
        if (background.hasCertifications) {
            recommendations.contentAdvice.push('List certifications that align with the target role or industry.');
        }
    
        if (goals.includes('Career Transition')) {
            recommendations.contentAdvice.push('Include a summary section that explains the transition and links past experience to the new role.');
        }
    
        if (strengths.includes('Technical Skills')) {
            recommendations.contentAdvice.push('Provide a detailed skills section categorized by tool, language, or domain.');
        }
    
        if (goals.includes('Research Opportunity')) {
            recommendations.contentAdvice.push('Highlight research experience, publications, and academic achievements.');
        }
    
        return recommendations;
    };
    
    // Example usage
    const persona = {
        experienceLevel: 'Intermediate',
        targetRole: 'Data Scientist',
        background: {
            yearsOfExperience: 2,
            educationLevel: 'Bachelor\'s Degree',
            hasProjects: true,
            hasCertifications: true,
            industries: ['Tech', 'Non-Profit'],
        },
        strengths: ['Technical Skills', 'Project Experience', 'Research Publications'],
        goals: ['Career Transition']
    };
    
    const resumeRecommendations = generateResumeRecommendations(persona);
    console.log(resumeRecommendations);
    {
        sections: [
            "Header",
            "Summary",
            "Experience",
            "Projects",
            "Education",
            "Certifications",
            "Research",
            "Skills"
        ],
        sectionOrder: [
            "Header",
            "Summary",
            "Skills",
            "Projects",
            "Experience",
            "Education",
            "Certifications"
        ],
        contentAdvice: [
            "Highlight specific accomplishments in past roles that align with the target role.",
            "Focus on projects that demonstrate technical skills or leadership.",
            "List certifications that align with the target role or industry.",
            "Include a summary section that explains the transition and links past experience to the new role.",
            "Provide a detailed skills section categorized by tool, language, or domain."
        ],
        reasoning: [
            "Experience is important to demonstrate real-world applications of skills.",
            "Projects showcase applied skills, which are valuable for roles requiring technical or hands-on expertise.",
            "Education is foundational, especially for early-career candidates or roles requiring specific degrees.",
            "Certifications validate specific technical skills or knowledge areas.",
            "Publications and research highlight academic and scientific achievements."
        ]
    }

    
    RESPONSE 2 :

    const generateCondensedResumeRecommendations = (persona) => {
        const recommendations = {
            sections: [],
            sectionOrder: [],
            contentAdvice: [],
            reasoning: []
        };
    
        const MAX_SECTIONS = 6; // Limit the number of sections to fit on one page
        const { experienceLevel, targetRole, background, strengths, goals } = persona;
    
        const sectionPriorities = [];
    
        // Define priority scores for sections based on relevance
        sectionPriorities.push(
            { section: "Header", priority: 10, reason: "Essential for identification." },
            { section: "Summary", priority: 9, reason: "Summarizes the candidate's fit for the target role." },
            { section: "Experience", priority: background.yearsOfExperience > 0 ? 8 : 4, reason: "Demonstrates practical skills." },
            { section: "Projects", priority: background.hasProjects ? 8 : 5, reason: "Showcases technical expertise and hands-on work." },
            { section: "Education", priority: background.educationLevel ? 7 : 3, reason: "Educational foundation for the target role." },
            { section: "Skills", priority: strengths.includes("Technical Skills") ? 9 : 6, reason: "Highlights expertise relevant to the role." },
            { section: "Certifications", priority: background.hasCertifications ? 7 : 3, reason: "Validates specialized knowledge." },
            { section: "Achievements", priority: strengths.includes("Leadership") ? 6 : 4, reason: "Showcases notable accomplishments." },
            { section: "Research", priority: roleCategories.RESEARCH_ROLES.includes(targetRole) ? 8 : 3, reason: "Highlights academic research contributions." },
            { section: "Volunteer", priority: background.industries.includes("Non-Profit") ? 5 : 2, reason: "Demonstrates social impact." }
        );
    
        // Sort sections by priority and take the top ones within MAX_SECTIONS
        const topSections = sectionPriorities
            .sort((a, b) => b.priority - a.priority)
            .slice(0, MAX_SECTIONS);
    
        // Populate recommendations with the most relevant sections
        recommendations.sections = topSections.map((section) => section.section);
        recommendations.reasoning = topSections.map((section) => section.reason);
    
        // Determine section order (e.g., prioritize certain sections for specific roles)
        if (targetRole) {
            if (roleCategories.TECHNICAL_ROLES.includes(targetRole)) {
                recommendations.sectionOrder = recommendations.sections.sort((a, b) => 
                    ["Header", "Summary", "Skills", "Projects", "Experience", "Education"].indexOf(a) -
                    ["Header", "Summary", "Skills", "Projects", "Experience", "Education"].indexOf(b)
                );
            } else if (roleCategories.RESEARCH_ROLES.includes(targetRole)) {
                recommendations.sectionOrder = recommendations.sections.sort((a, b) =>
                    ["Header", "Summary", "Research", "Education", "Publications", "Skills"].indexOf(a) -
                    ["Header", "Summary", "Research", "Education", "Publications", "Skills"].indexOf(b)
                );
            } else if (roleCategories.BUSINESS_ROLES.includes(targetRole)) {
                recommendations.sectionOrder = recommendations.sections.sort((a, b) =>
                    ["Header", "Summary", "Experience", "Education", "Achievements", "Skills"].indexOf(a) -
                    ["Header", "Summary", "Experience", "Education", "Achievements", "Skills"].indexOf(b)
                );
            } else {
                recommendations.sectionOrder = recommendations.sections;
            }
        } else {
            recommendations.sectionOrder = recommendations.sections;
        }
    
        // Provide concise content-specific advice
        if (background.yearsOfExperience > 0) {
            recommendations.contentAdvice.push("Include 2-3 key experiences that align with the target role.");
        }
    
        if (background.hasProjects) {
            recommendations.contentAdvice.push("List 2-3 impactful projects, highlighting your role and outcomes.");
        }
    
        if (background.educationLevel) {
            recommendations.contentAdvice.push("Include your highest degree and relevant coursework.");
        }
    
        if (background.hasCertifications) {
            recommendations.contentAdvice.push("Mention certifications that directly relate to the target role.");
        }
    
        if (goals.includes("Career Transition")) {
            recommendations.contentAdvice.push("Craft a summary that connects past experiences to your new goals.");
        }
    
        if (strengths.includes("Technical Skills")) {
            recommendations.contentAdvice.push("Include a skills section tailored to tools and technologies for the target role.");
        }
    
        return recommendations;
    };
    
    // Example Usage
    const persona = {
        experienceLevel: 'Intermediate',
        targetRole: 'Data Scientist',
        background: {
            yearsOfExperience: 2,
            educationLevel: 'Bachelor\'s Degree',
            hasProjects: true,
            hasCertifications: true,
            industries: ['Tech'],
        },
        strengths: ['Technical Skills', 'Project Experience'],
        goals: ['Career Transition']
    };
    
    const recommendations = generateCondensedResumeRecommendations(persona);
    console.log(recommendations);
    
    {
        sections: [
            "Header",
            "Summary",
            "Skills",
            "Projects",
            "Experience",
            "Education"
        ],
        sectionOrder: [
            "Header",
            "Summary",
            "Skills",
            "Projects",
            "Experience",
            "Education"
        ],
        contentAdvice: [
            "Include 2-3 key experiences that align with the target role.",
            "List 2-3 impactful projects, highlighting your role and outcomes.",
            "Include your highest degree and relevant coursework.",
            "Mention certifications that directly relate to the target role.",
            "Craft a summary that connects past experiences to your new goals.",
            "Include a skills section tailored to tools and technologies for the target role."
        ],
        reasoning: [
            "Essential for identification.",
            "Summarizes the candidate's fit for the target role.",
            "Highlights expertise relevant to the role.",
            "Showcases technical expertise and hands-on work.",
            "Demonstrates practical skills.",
            "Educational foundation for the target role."
        ]
    }
    