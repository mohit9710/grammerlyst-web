"use client";

import { useState } from "react";
import { applyPartner } from "@/services/partnerService";
import { useRouter } from "next/navigation";

export default function BecomePartnerPage() {
  const [form, setForm] = useState({
    institute_name: "",
    contact_person: "",
    email: "",
    phone: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applyPartner(form);
      alert("Application submitted 🚀");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 🔥 HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-black mb-6">
          Become a Grammrlyst Partner
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-blue-100">
          Help your students improve English speaking and earn up to 
          <span className="font-bold text-white"> 30% commission</span> on every purchase.
        </p>

        <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition">
          Start Earning Today
        </button>
      </section>

      {/* 💡 BENEFITS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">
          Why Partner With Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Earn Commission",
              desc: "Get 10%–30% on every student purchase",
            },
            {
              title: "Improve Results",
              desc: "Help students crack interviews with better English",
            },
            {
              title: "Track Growth",
              desc: "Monitor students & earnings from your dashboard",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm border"
            >
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💰 COMMISSION */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl font-black text-center mb-12">
          Commission Structure
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { range: "0–50 students", percent: "10%" },
            { range: "50–200 students", percent: "20%" },
            { range: "200+ students", percent: "30%" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between p-5 border rounded-xl"
            >
              <span className="font-semibold">{item.range}</span>
              <span className="font-bold text-blue-600">
                {item.percent}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 📝 FORM */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-10">
          Apply Now
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            type="text"
            placeholder="Institute Name"
            className="w-full px-5 py-4 rounded-xl border"
            required
            onChange={(e) =>
              setForm({ ...form, institute_name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Contact Person"
            className="w-full px-5 py-4 rounded-xl border"
            required
            onChange={(e) =>
              setForm({ ...form, contact_person: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-4 rounded-xl border"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Phone Number"
            className="w-full px-5 py-4 rounded-xl border"
            required
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Website"
            className="w-full px-5 py-4 rounded-xl border"
            onChange={(e) =>
              setForm({ ...form, website: e.target.value })
            }
          />

          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition">
            {loading ? "Submitting..." : "Become a Partner"}
          </button>
        </form>
      </section>

      {/* 🚀 CTA */}
      <section className="bg-slate-900 text-white py-16 text-center">
        <h2 className="text-3xl font-black mb-4">
          Start Growing With Grammrlyst
        </h2>
        <p className="text-slate-400 mb-6">
          Join 100+ institutes already earning with us.
        </p>
        <button className="bg-blue-600 px-8 py-4 rounded-xl font-bold"
        
        onClick={handleSubmit}>
          Apply Now
        </button>
      </section>
    </div>
  );
}