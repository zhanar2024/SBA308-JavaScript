// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0, // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833, // late: (140 - 15) / 150
    },
  ];

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

function validateInput(courseInfo, assignmentGroup, learnerSubmissions) {
  if (
    !courseInfo ||
    typeof courseInfo.id !== "number" ||
    typeof courseInfo.name !== "string"
  ) {
    throw new Error(
      "Invalid input: CourseInfo object is missing or incorrectly formatted."
    );
  }

  if (
    !assignmentGroup ||
    typeof assignmentGroup.id !== "number" ||
    typeof assignmentGroup.name !== "string" ||
    typeof assignmentGroup.course_id !== "number" ||
    typeof assignmentGroup.group_weight !== "number" ||
    !Array.isArray(assignmentGroup.assignments)
  ) {
    throw new Error(
      "Invalid input: AssignmentGroup object is missing or incorrectly formatted."
    );
  }

  // Validate each AssignmentInfo object within assignments array
  for (let assignment of assignmentGroup.assignments) {
    if (
      typeof assignment.id !== "number" ||
      typeof assignment.name !== "string" ||
      typeof assignment.due_at !== "string" ||
      isNaN(new Date(assignment.due_at).getTime()) ||
      typeof assignment.points_possible !== "number"
    ) {
      throw new Error(
        "Invalid input: AssignmentInfo object within assignments array is missing or incorrectly formatted."
      );
    }
  }

  // Validate LearnerSubmission objects
  for (let submission of learnerSubmissions) {
    if (
      typeof submission.learner_id !== "number" ||
      typeof submission.assignment_id !== "number" ||
      typeof submission.submission !== "object" ||
      typeof submission.submission.submitted_at !== "string" ||
      isNaN(new Date(submission.submission.submitted_at).getTime()) ||
      typeof submission.submission.score !== "number"
    ) {
      throw new Error(
        "Invalid input: LearnerSubmission object is missing or incorrectly formatted."
      );
    }
  }
}

function processLearnerSubmissions(assignmentGroup, learnerSubmissions) {
  let learnerData = [];
  for (let submission of learnerSubmissions) {
    let submissionData = {
      id: submission.learner_id,
      avg: 0,
      latePenalty: 0,
      scores: {},
    };

    for (let assignment of assignmentGroup.assignments) {
      // Check if assignment is due and if learner has submitted for this assignment
      if (
        new Date(assignment.due_at) < new Date() &&
        submission.assignment_id === assignment.id
      ) {
        // Calculate score percentage
        let scorePercentage =
          (submission.submission.score / assignment.points_possible) * 100;

        // Apply late penalty if submission is late
        if (
          new Date(submission.submission.submitted_at) >
          new Date(assignment.due_at)
        ) {
          let latePenalty = assignment.points_possible * 0.1;
          scorePercentage -= (latePenalty / assignment.points_possible) * 100;
          submissionData.latePenalty += latePenalty;
        }

        // Add assignment score to scores dictionary
        submissionData.scores[assignment.id] = scorePercentage;

        // Calculate weighted average
        submissionData.avg +=
          (scorePercentage / 100) * assignment.points_possible;
      }
    }

    // Deduct late penalty from weighted average
    submissionData.avg -= submissionData.latePenalty;

    // Add learner data to the result array
    learnerData.push(submissionData);
  }

  return learnerData;
}

// Example data
let courseInfo = {
  id: 1,
  name: "Course Name",
};

let assignmentGroup = {
  id: 1,
  name: "Assignment Group Name",
  course_id: 1,
  group_weight: 50,
  assignments: [
    {
      id: 1,
      name: "Assignment 1",
      due_at: "2024-06-01T23:59:59Z",
      points_possible: 100,
    },
    {
      id: 2,
      name: "Assignment 2",
      due_at: "2024-06-05T23:59:59Z",
      points_possible: 200,
    },
  ],
};

let learnerSubmissions = [
  {
    learner_id: 1,
    assignment_id: 1,
    submission: {
      submitted_at: "2024-06-01T22:00:00Z",
      score: 90,
    },
  },
  {
    learner_id: 1,
    assignment_id: 2,
    submission: {
      submitted_at: "2024-06-05T23:59:59Z",
      score: 180,
    },
  },
];

// Get learner data
try {
  let result = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
  console.log(result);
} catch (error) {
  console.error(error.message);
}
