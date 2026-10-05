import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  LoaderCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";


type Pengajuan = {
  id: number;

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
};


const AdminPengajuanPage = () => {
  const navigate = useNavigate();

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Pengajuan | null>(null);

  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const [showTolak, setShowTolak] = useState(false);
  const [alasan, setAlasan] = useState("");

  const [error, setError] = useState("");


  const getPengajuan = async () => {
    try {
      setLoading(true);

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

      setError(
        "Gagal mengambil data pengajuan."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    getPengajuan();
  }, []);


  const handleTerima = async (
    id: number
  ) => {
    try {
      setLoadingAction(id);
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/admin/pengajuan/${id}/terima`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelected(null);

      await getPengajuan();

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        "Gagal menerima pengajuan."
      );

    } finally {

      setLoadingAction(null);

    }
  };


  const handleTolak = async () => {
    if (!selected) {
      return;
    }

    if (!alasan.trim()) {
      setError(
        "Alasan penolakan wajib diisi."
      );

      return;
    }


    try {
      setLoadingAction(selected.id);
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/admin/pengajuan/${selected.id}/tolak`,
        {
          alasan: alasan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowTolak(false);
      setSelected(null);
      setAlasan("");

      await getPengajuan();

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        "Gagal menolak pengajuan."
      );

    } finally {

      setLoadingAction(null);

    }
  };


  const getStatusStyle = (
    status: Pengajuan["status"]
  ) => {
    if (status === "diterima") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "ditolak") {
      return "bg-red-100 text-red-700";
    }

    return "bg-[#F6BF41]/20 text-[#0A2C51]";
  };


  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="flex items-center gap-2 text-sm font-semibold text-[#0A2C51]"
          >
            <ArrowLeft size={19} />

            Dashboard Admin
          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F6BF41]">
          Administrator
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#0A2C51] sm:text-3xl">
          Pengajuan Paslon
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Periksa data pasangan calon sebelum menerima atau menolak pengajuan.
        </p>


        {error && (

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>

        )}


        {/* LIST */}
        <section className="mt-8">

          {loading ? (

            <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-12">

              <LoaderCircle
                size={26}
                className="animate-spin text-[#0A2C51]"
              />

            </div>

          ) : pengajuan.length === 0 ? (

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Belum ada pengajuan paslon.
            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {pengajuan.map((item) => (

                <article
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-xs text-slate-400">
                        Pengajuan #{item.id}
                      </p>

                      <h2 className="mt-1 font-bold text-[#0A2C51]">
                        {item.nama_ketua}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        & {item.nama_wakil}
                      </p>

                    </div>


                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="overflow-hidden rounded-xl bg-slate-100">

                      {item.foto_ketua ? (

                        <img
                          src={item.foto_ketua}
                          alt={item.nama_ketua}
                          className="aspect-[3/4] w-full object-cover"
                        />

                      ) : (

                        <div className="aspect-[3/4]" />

                      )}

                    </div>


                    <div className="overflow-hidden rounded-xl bg-slate-100">

                      {item.foto_wakil ? (

                        <img
                          src={item.foto_wakil}
                          alt={item.nama_wakil}
                          className="aspect-[3/4] w-full object-cover"
                        />

                      ) : (

                        <div className="aspect-[3/4]" />

                      )}

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      setSelected(item)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0A2C51] transition hover:border-[#F6BF41]"
                  >
                    <Eye size={17} />

                    Lihat Detail
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* DETAIL MODAL */}
      {selected && (

        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">

          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-2xl sm:rounded-3xl">

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">

              <div>

                <p className="text-xs text-slate-400">
                  Detail Pengajuan
                </p>

                <h2 className="font-bold text-[#0A2C51]">
                  Pasangan Calon
                </h2>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setShowTolak(false);
                  setAlasan("");
                }}
                className="rounded-lg p-2 text-slate-500"
              >
                <X size={21} />
              </button>

            </div>


            <div className="p-5 sm:p-6">

              {/* FOTO */}
              <div className="grid grid-cols-2 gap-3">

                <div>

                  <div className="overflow-hidden rounded-2xl bg-slate-100">

                    {selected.foto_ketua && (

                      <img
                        src={selected.foto_ketua}
                        alt={selected.nama_ketua}
                        className="aspect-[3/4] w-full object-cover"
                      />

                    )}

                  </div>

                  <p className="mt-3 text-center font-bold text-[#0A2C51]">
                    {selected.nama_ketua}
                  </p>

                  <p className="text-center text-xs text-slate-400">
                    Ketua
                  </p>

                </div>


                <div>

                  <div className="overflow-hidden rounded-2xl bg-slate-100">

                    {selected.foto_wakil && (

                      <img
                        src={selected.foto_wakil}
                        alt={selected.nama_wakil}
                        className="aspect-[3/4] w-full object-cover"
                      />

                    )}

                  </div>

                  <p className="mt-3 text-center font-bold text-[#0A2C51]">
                    {selected.nama_wakil}
                  </p>

                  <p className="text-center text-xs text-slate-400">
                    Wakil Ketua
                  </p>

                </div>

              </div>


              {/* VISI */}
              <div className="mt-6 border-t border-slate-100 pt-5">

                <p className="text-xs font-bold uppercase tracking-wide text-[#F6BF41]">
                  Visi
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selected.visi}
                </p>

              </div>


              {/* MISI */}
              <div className="mt-5">

                <p className="text-xs font-bold uppercase tracking-wide text-[#F6BF41]">
                  Misi
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {selected.misi}
                </p>

              </div>


              {/* ALASAN */}
              {showTolak && (

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Alasan Penolakan
                  </label>

                  <textarea
                    value={alasan}
                    onChange={(event) =>
                      setAlasan(event.target.value)
                    }
                    rows={4}
                    placeholder="Tuliskan alasan pengajuan ditolak..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#F6BF41] focus:ring-4 focus:ring-[#F6BF41]/15"
                  />

                </div>

              )}


              {/* BUTTON */}
              {selected.status === "menunggu" && (

                <div className="mt-7 grid gap-3 sm:grid-cols-2">

                  {!showTolak ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setShowTolak(true)
                        }
                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 font-semibold text-red-600"
                      >
                        <X size={18} />

                        Tolak
                      </button>

                      <button
                        type="button"
                        disabled={
                          loadingAction === selected.id
                        }
                        onClick={() =>
                          handleTerima(selected.id)
                        }
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F6BF41] font-bold text-[#0A2C51] disabled:opacity-50"
                      >
                        <Check size={18} />

                        Terima
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowTolak(false);
                          setAlasan("");
                        }}
                        className="h-12 rounded-xl border border-slate-200 font-semibold text-slate-600"
                      >
                        Batal
                      </button>

                      <button
                        type="button"
                        disabled={
                          loadingAction === selected.id
                        }
                        onClick={handleTolak}
                        className="h-12 rounded-xl bg-red-600 font-semibold text-white disabled:opacity-50"
                      >
                        Konfirmasi Tolak
                      </button>
                    </>
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


export default AdminPengajuanPage;