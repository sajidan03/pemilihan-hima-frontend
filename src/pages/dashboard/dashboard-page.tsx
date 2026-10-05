import { useEffect, useState } from "react";

import { LogOut, Menu, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import api from "../../services/api";


type Periode = {
  id: number;
  tahun: string;
  nama_pemilihan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: "draft" | "berlangsung" | "selesai";
  tampilkan_hasil: number;
};


type Paslon = {
  id: number;
  nomor_urut: number;
  visi: string;
  misi: string;
  foto_ketua: string | null;
  foto_wakil: string | null;
  nama_ketua: string;
  nama_wakil: string;
};


type DashboardResponse = {
  periode: Periode;
  paslon: Paslon[];
};


const DashboardPage = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [periode, setPeriode] = useState<Periode | null>(null);
  const [paslon, setPaslon] = useState<Paslon[]>([]);


  const userRaw = localStorage.getItem("user");

  const user = userRaw
    ? JSON.parse(userRaw)
    : null;


  useEffect(() => {
    const getDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get<DashboardResponse>(
          "/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPeriode(response.data.periode);
        setPaslon(response.data.paslon);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    getDashboard();

  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center">

              <img
                src={logo}
                alt="Logo Informatika UMTAS"
                className="h-full w-full object-contain"
              />

            </div>


            <div>

              <h1 className="text-sm font-bold text-[#0A2C51] sm:text-base">
                Informatika UMTAS
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Pemilihan Ketua HIMA
              </p>

            </div>

          </div>


          {/* NAVBAR DESKTOP */}
          <nav className="hidden items-center gap-6 md:flex">

            <a
              href="#beranda"
              className="text-sm font-semibold text-[#0A2C51]"
            >
              Beranda
            </a>


           <button
  type="button"
  onClick={() => {
    setMenuOpen(false);
    navigate("/pengajuan");
  }}
  className="rounded-lg px-3 py-2 text-left text-sm text-slate-600"
>
  Calonkan Diri
</button>


            <button
  type="button"
  onClick={() => navigate("/voting")}
  className="text-sm font-medium text-slate-600 transition hover:text-[#0A2C51]"
>
  Voting
</button>


            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-[#0A2C51] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <LogOut size={16} />

              Keluar
            </button>

          </nav>


          {/* BUTTON MOBILE */}
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


        {/* MOBILE MENU */}
        {menuOpen && (

          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">

            <div className="flex flex-col gap-2">

              <a
                href="#beranda"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0A2C51]"
              >
                Beranda
              </a>


              <button
                type="button"
                  onClick={() => {
    setMenuOpen(false);
    navigate("/pengajuan");
  }}
                className="rounded-lg px-3 py-2 text-left text-sm text-slate-600"
              >
                Calonkan Diri
              </button>


              <button
                type="button"
                  onClick={() => navigate("/voting")}
                className="rounded-lg px-3 py-2 text-left text-sm text-slate-600"
              >
                Voting
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



      {/* CONTENT */}
      <main
        id="beranda"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >


        {/* HERO */}
        <section className="overflow-hidden rounded-3xl bg-[#0A2C51] p-6 text-white sm:p-8 lg:p-10">

          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#F6BF41]">

              {periode?.nama_pemilihan ||
                "Pemilihan Ketua HIMA"}

            </span>


            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">

              Selamat datang,

              <span className="block text-[#F6BF41]">

                {user?.nama || "Mahasiswa"}

              </span>

            </h2>


            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">

              Gunakan hak pilihmu dengan bijak dan ikuti seluruh proses
              pemilihan Ketua HIMA Informatika UMTAS melalui sistem ini.

            </p>

          </div>

        </section>



        {/* INFO */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <p className="text-sm text-slate-500">
              Status Pemilihan
            </p>

            <p className="mt-2 text-lg font-bold capitalize text-[#0A2C51]">

              {periode?.status || "-"}

            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <p className="text-sm text-slate-500">
              Periode
            </p>

            <p className="mt-2 text-lg font-bold text-[#0A2C51]">

              {periode?.tahun || "-"}

            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-2 lg:col-span-1">

            <p className="text-sm text-slate-500">
              Jumlah Paslon
            </p>

            <p className="mt-2 text-lg font-bold text-[#0A2C51]">

              {paslon.length}

            </p>

          </div>

        </section>



        {/* PASLON */}
        <section className="mt-10">

          <div className="mb-5">

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F6BF41]">
              Kandidat
            </p>

            <h3 className="mt-2 text-2xl font-bold text-[#0A2C51]">
              Pasangan Calon
            </h3>

          </div>


          {loading ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">

              Memuat data...

            </div>

          ) : paslon.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">

              Belum ada pasangan calon.

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {paslon.map((item) => (

                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >


                  {/* NOMOR URUT */}
                  <div className="flex items-center justify-between bg-[#0A2C51] px-5 py-4">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                        Pasangan Calon
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Nomor Urut
                      </p>

                    </div>


                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F6BF41] text-base font-bold text-[#0A2C51]">

                      {item.nomor_urut}

                    </span>

                  </div>



                  <div className="p-5">


                    {/* FOTO KETUA + WAKIL */}
                    <div className="grid grid-cols-2 gap-3">


                      {/* KETUA */}
                      <div>

                        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100">

                          {item.foto_ketua ? (

                            <img
                              src={item.foto_ketua}
                              alt={`Foto ${item.nama_ketua}`}
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">

                              Tidak ada foto

                            </div>

                          )}

                        </div>


                        <div className="mt-3 text-center">

                          <h4 className="line-clamp-2 text-sm font-bold text-[#0A2C51] sm:text-base">

                            {item.nama_ketua}

                          </h4>

                          <p className="mt-1 text-xs text-slate-500">

                            Ketua

                          </p>

                        </div>

                      </div>



                      {/* WAKIL */}
                      <div>

                        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100">

                          {item.foto_wakil ? (

                            <img
                              src={item.foto_wakil}
                              alt={`Foto ${item.nama_wakil}`}
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">

                              Tidak ada foto

                            </div>

                          )}

                        </div>


                        <div className="mt-3 text-center">

                          <h4 className="line-clamp-2 text-sm font-bold text-[#0A2C51] sm:text-base">

                            {item.nama_wakil}

                          </h4>

                          <p className="mt-1 text-xs text-slate-500">

                            Wakil Ketua

                          </p>

                        </div>

                      </div>

                    </div>



                    {/* VISI */}
                    <div className="mt-6 border-t border-slate-100 pt-5">

                      <p className="text-xs font-bold uppercase tracking-wide text-[#F6BF41]">

                        Visi

                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">

                        {item.visi}

                      </p>

                    </div>



                    {/* MISI */}
                    <div className="mt-5">

                      <p className="text-xs font-bold uppercase tracking-wide text-[#F6BF41]">

                        Misi

                      </p>

                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">

                        {item.misi}

                      </p>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};


export default DashboardPage;