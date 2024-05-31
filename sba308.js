function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  validateInput(courseInfo, assignmentGroup, learnerSubmissions);
  if (assignmentGroup.course_id !== courseInfo.id) {
    throw new Error(
      "Invalid input: Assignment group does not belong to the specified course."
    );
  }

  // Process learner submissions
  let learnerData = processLearnerSubmissions(
    assignmentGroup,
    learnerSubmissions
  );

  return learnerData;
}

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
