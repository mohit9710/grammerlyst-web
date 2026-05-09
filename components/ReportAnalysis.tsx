"use client";

interface Props {
  user: any;
}

export default function ReportAnalysis({
  user,
}: Props) {
  // Dummy progress data
  const progressData = [
    { day: "Mon", score: 40 },
    { day: "Tue", score: 55 },
    { day: "Wed", score: 65 },
    { day: "Thu", score: 70 },
    { day: "Fri", score: 76 },
    { day: "Sat", score: 82 },
    { day: "Sun", score: 91 },
  ];

  const skillsData = [
    {
      skill: "Grammar",
      score: 85,
    },
    {
      skill: "Vocabulary",
      score: 72,
    },
    {
      skill: "Speaking",
      score: 91,
    },
    {
      skill: "Pronunciation",
      score: 76,
    },
    {
      skill: "Listening",
      score: 80,
    },
  ];

  const maxProgress = Math.max(
    ...progressData.map((d) => d.score)
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-[2rem] shadow border p-8">
        <h2 className="text-3xl font-black mb-2">
          Your Learning Analysis
        </h2>

        <p className="text-slate-500">
          Track your English learning
          performance and daily progress.
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total XP"
          value={user.total_xp || 0}
        />

        <StatCard
          title="Current Streak"
          value={`${user.streak || 0} Days`}
        />

        <StatCard
          title="Points"
          value={user.points || 0}
        />

        <StatCard
          title="Bonus"
          value={user.bonus || 0}
        />
      </div>

      {/* WEEKLY PROGRESS */}
      <div className="bg-white rounded-[2rem] shadow border p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black">
              Weekly Progress
            </h3>

            <p className="text-slate-500 mt-1">
              Your learning consistency this
              week
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">
              Best Score
            </p>

            <h2 className="text-3xl font-black text-blue-600">
              {maxProgress}%
            </h2>
          </div>
        </div>

        <div className="space-y-5">
          {progressData.map((item) => (
            <div key={item.day}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  {item.day}
                </span>

                <span className="text-slate-500">
                  {item.score}%
                </span>
              </div>

              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${item.score}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILL ANALYSIS */}
      <div className="bg-white rounded-[2rem] shadow border p-8">
        <h3 className="text-2xl font-black mb-8">
          Skill Breakdown
        </h3>

        <div className="space-y-6">
          {skillsData.map((item) => (
            <div key={item.skill}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  {item.skill}
                </span>

                <span className="font-bold">
                  {item.score}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.score >= 85
                      ? "bg-green-500"
                      : item.score >= 70
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                  style={{
                    width: `${item.score}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl">
        <h3 className="text-2xl font-black mb-6">
          AI Insights
        </h3>

        <div className="space-y-4 text-blue-100">
          <div className="flex gap-3">
            <span>🔥</span>

            <p>
              Your speaking fluency improved
              significantly this week.
            </p>
          </div>

          <div className="flex gap-3">
            <span>📚</span>

            <p>
              Vocabulary practice can help you
              achieve advanced fluency faster.
            </p>
          </div>

          <div className="flex gap-3">
            <span>🎯</span>

            <p>
              Your pronunciation consistency is
              above average.
            </p>
          </div>

          <div className="flex gap-3">
            <span>🚀</span>

            <p>
              Maintain your daily streak to
              maximize XP growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white rounded-2xl shadow border p-6 text-center">
      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-black mt-2 text-slate-800">
        {value}
      </h2>
    </div>
  );
}