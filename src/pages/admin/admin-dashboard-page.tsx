import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileUser,
  LogOut,
  Menu,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import api from "../../services/api";


type Pengajuan = {
  id: number;
  id_ketua?: number;
  id_wakil?: number;

  nama_ketua: string;
  nama_wakil: string;

  nim_ketua?: string;
  nim_wakil?: string;

  visi: string;
  misi: string;

  foto_ketua: string | null;
  foto_wakil: string | null;

  status: "menunggu" | "diterima" | "ditolak";

  alasan_penolakan?: string | null;

  created_at?: string;
};


const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);


  const userRaw = localStorage.getItem("user");

  const user = userRaw
    ? JSON.parse(userRaw)
    : null;


  useEffect(() => {
    const getPengajuan = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          "/admin/pengajuan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setPengajuan(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };


    getPengajuan();

  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  const totalPengajuan = pengajuan.length;

  const menunggu = pengajuan.filter(
    (item) => item.status === "menunggu"
  ).length;

  const diterima = pengajuan.filter(
    (item) => item.status === "diterima"
  ).length;

  const ditolak = pengajuan.filter(
    (item) => item.status === "ditolak"
  ).length;


  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <img
              src={logo}
              alt="Logo Informatika UMTAS"
              className="h-10 w-10 object-contain"
            />

            <div>

              <h1 className="text-sm font-bold text-[#0A2C51] sm:text-base">
                Informatika UMTAS
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Panel Administrator
              </p>

            </div>

          </div>


          {/* DESKTOP */}
          <nav className="hidden items-center gap-6 md:flex">

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-sm font-semibold text-[#0A2C51]"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/pengajuan")
              }
              className="text-sm font-medium text-slate-600 transition hover:text-[#0A2C51]"
            >
              Pengajuan Paslon
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-[#0A2C51] px-4 py-2 text-sm font-semibold text-white"
            >
              <LogOut size={16} />
              Keluar
            </button>

          </nav>


          {/* MOBILE */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            className="rounded-lg p-2 text-[#0A2C51] md:hidden"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>


        {menuOpen && (

          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">

            <div className="flex flex-col gap-2">

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin");
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#0A2C51]"
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/pengajuan");
                }}
                className="rounded-lg px-3 py-2 text-left text-sm text-slate-600"
              >
                Pengajuan Paslon
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 rounded-lg bg-[#0A2C51] px-3 py-2 text-sm font-semibold text-white"
              >
                <LogOut size={16} />
                Keluar
              </button>

            </div>

          </div>

        )}

      </header>


      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HERO */}
        <section className="overflow-hidden rounded-3xl bg-[#0A2C51] p-6 text-white sm:p-8 lg:p-10">

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F6BF41]">
            Administrator
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Selamat datang,
            <span className="block text-[#F6BF41]">
              {user?.nama || "Admin"}
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Kelola proses pemilihan Ketua HIMA Informatika UMTAS
            melalui panel administrator.
          </p>

        </section>


        {/* STATISTIK */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A2C51]/10 text-[#0A2C51]">
              <FileUser size={20} />
            </div>

            <p className="mt-4 text-xs text-slate-500 sm:text-sm">
              Total Pengajuan
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0A2C51]">
              {loading ? "-" : totalPengajuan}
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6BF41]/20 text-[#0A2C51]">
              <Clock3 size={20} />
            </div>

            <p className="mt-4 text-xs text-slate-500 sm:text-sm">
              Menunggu
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0A2C51]">
              {loading ? "-" : menunggu}
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>

            <p className="mt-4 text-xs text-slate-500 sm:text-sm">
              Diterima
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0A2C51]">
              {loading ? "-" : diterima}
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <XCircle size={20} />
            </div>

            <p className="mt-4 text-xs text-slate-500 sm:text-sm">
              Ditolak
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0A2C51]">
              {loading ? "-" : ditolak}
            </p>

          </div>

        </section>


        {/* ACTION */}
        <section className="mt-8">

          <h3 className="text-xl font-bold text-[#0A2C51]">
            Kelola Pemilihan
          </h3>


          <button
            type="button"
            onClick={() =>
              navigate("/admin/pengajuan")
            }
            className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#F6BF41] sm:max-w-md"
          >

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F6BF41] text-[#0A2C51]">
              <UserCheck size={22} />
            </div>

            <div>

              <p className="font-bold text-[#0A2C51]">
                Konfirmasi Pengajuan Paslon
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {menunggu} pengajuan sedang menunggu konfirmasi.
              </p>

            </div>

          </button>

        </section>

      </main>

    </div>
  );
};


export default AdminDashboardPage;