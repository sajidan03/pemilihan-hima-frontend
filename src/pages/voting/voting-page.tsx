import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Vote,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

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

  nama_ketua: string;
  nama_wakil: string;

  visi: string;
  misi: string;

  foto_ketua: string | null;
  foto_wakil: string | null;
};


type DashboardResponse = {
  periode: Periode;
  paslon: Paslon[];
};


const VotingPage = () => {
  const navigate = useNavigate();

  const [periode, setPeriode] = useState<Periode | null>(null);

  const [paslon, setPaslon] = useState<Paslon[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedPaslon, setSelectedPaslon] =
    useState<Paslon | null>(null);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {
    const getData = async () => {
      try {
        const token =
          localStorage.getItem("token");


        const response =
          await api.get<DashboardResponse>(
            "/dashboard",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );


        setPeriode(
          response.data.periode
        );

        setPaslon(
          response.data.paslon
        );

      } catch (error) {

        console.error(error);

        setError(
          "Gagal mengambil data pasangan calon."
        );

      } finally {

        setLoading(false);

      }
    };


    getData();

  }, []);


  const handlePilih = (
    item: Paslon
  ) => {
    setError("");
    setSuccess("");

    setSelectedPaslon(item);

    setShowConfirm(true);
  };


  const handleVoting = async () => {
    if (!selectedPaslon) {
      return;
    }


    try {
      setSubmitting(true);

      setError("");
      setSuccess("");


      const token =
        localStorage.getItem("token");


      const response =
        await api.post(
          "/voting",
          {
            id_paslon:
              selectedPaslon.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


      setSuccess(
        response.data.message ||
        "Voting berhasil."
      );


      setShowConfirm(false);


    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        "Voting gagal dilakukan."
      );

      setShowConfirm(false);

    } finally {

      setSubmitting(false);

    }
  };


  const votingDibuka =
    periode?.status === "berlangsung";


  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 text-sm font-semibold text-[#0A2C51]"
          >
            <ArrowLeft size={19} />

            Kembali
          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* TITLE */}
        <section>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F6BF41]">
            Pemilihan Ketua HIMA
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#0A2C51] sm:text-3xl">
            Voting Pasangan Calon
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Pilih pasangan calon sesuai pilihanmu.
            Pastikan pilihan sudah benar sebelum
            melakukan konfirmasi.
          </p>

        </section>


        {/* STATUS */}
        <section className="mt-6">

          <div
            className={`
              rounded-2xl border px-4 py-4
              ${
                votingDibuka
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[#F6BF41]/40 bg-[#F6BF41]/10"
              }
            `}
          >

            <p
              className={`
                text-sm font-semibold
                ${
                  votingDibuka
                    ? "text-emerald-700"
                    : "text-[#0A2C51]"
                }
              `}
            >
              {votingDibuka
                ? "Voting sedang berlangsung."
                : periode?.status === "draft"
                  ? "Voting belum dibuka."
                  : "Voting telah selesai."}
            </p>

          </div>

        </section>


        {/* ERROR */}
        {error && (

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>

        )}


        {/* SUCCESS */}
        {success && (

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={22}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div>

                <p className="font-semibold text-emerald-700">
                  Voting Berhasil
                </p>

                <p className="mt-1 text-sm text-emerald-600">
                  {success}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* PASLON */}
        <section className="mt-8">

          {loading ? (

            <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-12">

              <LoaderCircle
                size={28}
                className="animate-spin text-[#0A2C51]"
              />

            </div>

          ) : paslon.length === 0 ? (

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Belum ada pasangan calon.
            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {paslon.map((item) => (

                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* HEADER CARD */}
                  <div className="flex items-center justify-between bg-[#0A2C51] px-5 py-4">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-white/50">
                        Pasangan Calon
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Nomor Urut
                      </p>

                    </div>


                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6BF41] text-lg font-bold text-[#0A2C51]">
                      {item.nomor_urut}
                    </div>

                  </div>


                  <div className="p-5">

                    {/* FOTO */}
                    <div className="grid grid-cols-2 gap-3">

                      {/* KETUA */}
                      <div>

                        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100">

                          {item.foto_ketua ? (

                            <img
                              src={item.foto_ketua}
                              alt={item.nama_ketua}
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              Tidak ada foto
                            </div>

                          )}

                        </div>


                        <div className="mt-3 text-center">

                          <p className="text-sm font-bold text-[#0A2C51]">
                            {item.nama_ketua}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
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
                              alt={item.nama_wakil}
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              Tidak ada foto
                            </div>

                          )}

                        </div>


                        <div className="mt-3 text-center">

                          <p className="text-sm font-bold text-[#0A2C51]">
                            {item.nama_wakil}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
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


                    {/* BUTTON */}
                    <button
                      type="button"
                      disabled={
                        !votingDibuka ||
                        Boolean(success)
                      }
                      onClick={() =>
                        handlePilih(item)
                      }
                      className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F6BF41] text-sm font-bold text-[#0A2C51] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      <Vote size={18} />

                      {success
                        ? "Sudah Voting"
                        : votingDibuka
                          ? `Pilih Nomor ${item.nomor_urut}`
                          : "Voting Belum Tersedia"}
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* MODAL KONFIRMASI */}
      {showConfirm && selectedPaslon && (

        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">

          <div className="w-full rounded-t-3xl bg-white p-5 sm:max-w-md sm:rounded-3xl sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F6BF41]">
                  Konfirmasi Voting
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#0A2C51]">
                  Yakin dengan pilihanmu?
                </h2>

              </div>


              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  setShowConfirm(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>


            <div className="mt-6 rounded-2xl bg-[#F4F7FB] p-4">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F6BF41] text-xl font-bold text-[#0A2C51]">
                  {selectedPaslon.nomor_urut}
                </div>


                <div>

                  <p className="font-bold text-[#0A2C51]">
                    {selectedPaslon.nama_ketua}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    & {selectedPaslon.nama_wakil}
                  </p>

                </div>

              </div>

            </div>


            <p className="mt-5 text-sm leading-6 text-slate-500">
              Setelah dikonfirmasi, pilihan tidak dapat diubah.
            </p>


            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  setShowConfirm(false)
                }
                className="h-12 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600"
              >
                Batal
              </button>


              <button
                type="button"
                disabled={submitting}
                onClick={handleVoting}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F6BF41] text-sm font-bold text-[#0A2C51] disabled:opacity-50"
              >

                {submitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />

                    Memproses
                  </>
                ) : (
                  <>
                    <Vote size={18} />

                    Ya, Pilih
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


export default VotingPage;