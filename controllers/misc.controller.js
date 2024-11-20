import { personalizedTemplatesHandler } from "../handlers/personalizedTemplates.handler.js";
import { missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";


export const getPersonalizedTemplates = async (req,res)=>{

	const userId = req.user._id;

	if(!userId){
		return notFoundError(res,"User Id",["id in jwt"]);
	}

	const { success, error, personalizedTemplates } = await personalizedTemplatesHandler(req.body,userId);
    
	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, personalizedTemplates, "Created personalized templates successfully");

};

// hi pooja . Yes you are talking to hemant . how are you today?


// Yes it is a great time to talk  and thanks for reaching out


// my experiecen with mern stack --------------------------
// "Yes, of course. I’ve been working with the MERN stack for quite some time now and have built several
//  projects using it. One of my notable projects is Profylr, which helps college students and juniors create
//   error-free, professional resumes with the help of AI. Additionally, I’m currently working at Ascentia Labs,
//    a company specializing in travel tech. I’ve been a core team member in developing Route Maestro, 
//    an AI-based package generation tool. We used the MERN stack extensively in this project as well. So,
//     yes, I have a strong background in the MERN stack and have worked on both individual and team-based
//      projects using it."

// any technical hardships-------------------------------
// "Yes, definitely. One time, our product was almost ready, and our CEO was about to demo it to a client.
//  The product calculated all possible routes between given cities and displayed the cost for each route,
//   using the most efficient mode of transport. Initially, we had tested it with 3-4 cities, but during 
//   the demo, the client input 10-12 cities at once, and our APIs crashed. At that time, I had just
//    graduated from college, and I was familiar with OS processes. I suggested that we move the computation
//     to multiple parallel threads, dividing the workload across threads and dynamically increasing the
//      number of workers as the number of cities scaled. With a small team of two, we implemented this 
//      solution, and now we can handle as many cities as needed without any issues. This was a very
//       intense but rewarding experience with Node.js."

//  when i team played and my role in it 
// "Yes, of course. I was later part of the API team responsible for building
//  a microservice that would fetch data for flights, hotels, and sightseeing
//   activities from various APIs and provide the best options to the frontend.
//    My responsibility was handling the flight data. One of the main challenges
//     we faced was aligning flight timings with hotel bookings and ensuring that
//      no important events or sightseeing activities were missed due to timing 
//      conflicts. This required close coordination with the hotel and event APIs
//       to make sure everything synced perfectly."

// why should we hire you ?
// "You should hire me because I have a strong technical foundation in
//  [mention your skills or technologies], combined with hands-on experience
//   in building scalable applications. I have a proactive approach to problem-solving
//    and enjoy collaborating with cross-functional teams to deliver high-quality solutions. 
//    I’m also excited about [Company Name]’s mission and believe my skills can help contribute
//     to your success, especially in [mention specific projects or areas you’re interested in]."

// What are your hobbies?
// "In my free time, I enjoy coding personal projects, which helps me stay up-to-date
//  with new technologies. I also love reading about AI and machine learning,
//   which keeps me curious and sharp in problem-solving. Outside of tech, I’m passionate about
//    playing soccer, as it helps me maintain a healthy balance and improve my teamwork skills."