export default function SupportPage() {
  return (
    <div className="bg-[#14162A] p-6 rounded-2xl border border-white/10 max-w-2xl">
      <h2 className="text-2xl font-bold mb-3">Support Center</h2>
      <p className="text-white/60 mb-5">
        Need help with the Admin Dashboard? Contact support or review the platform documentation.
      </p>

      <div className="space-y-3">
        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="font-semibold">Email Support</h3>
          <p className="text-white/50">support@admin-dashboard.com</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="font-semibold">Working Hours</h3>
          <p className="text-white/50">Sunday - Thursday | 9:00 AM - 5:00 PM</p>
        </div>
      </div>
    </div>
  )
}
