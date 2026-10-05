import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  Camera,
  ChevronDown,
  FileImage,
  LoaderCircle,
  Send,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";


type Mahasiswa = {
  id: number;
  nama: string;
  nim: string;
};


type WakilResponse = {
  data: Mahasiswa[];
};


const PengajuanPage = () => {
  const navigate = useNavigate();

  const [daftarWakil, setDaftarWakil] = useState<Mahasiswa[]>([]);

  const [idWakil, setIdWakil] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");

  const [fotoKetua, setFotoKetua] = useState<File | null>(null);
  const [fotoWakil, setFotoWakil] = useState<File | null>(null);

  const [previewKetua, setPreviewKetua] = useState<string | null>(null);
  const [previewWakil, setPreviewWakil] = useState<string | null>(null);

  const [loadingWakil, setLoadingWakil] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    const getWakil = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get<WakilResponse>(
          "/mahasiswa/wakil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDaftarWakil(response.data.data);

      } catch (error) {

        console.error(error);

        setError(
          "Gagal mengambil daftar calon wakil."
        );

      } finally {

        setLoadingWakil(false);

      }
    };


    getWakil();

  }, []);


  const handleFotoKetua = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }


    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Ukuran foto ketua maksimal 2 MB."
      );

      event.target.value = "";

      return;
    }


    if (previewKetua) {
      URL.revokeObjectURL(previewKetua);
    }


    setFotoKetua(file);

    const preview =
      URL.createObjectURL(file);

    setPreviewKetua(preview);

    setError("");
  };


  const handleFotoWakil = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }


    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Ukuran foto wakil maksimal 2 MB."
      );

      event.target.value = "";

      return;
    }


    if (previewWakil) {
      URL.revokeObjectURL(previewWakil);
    }


    setFotoWakil(file);

    const preview =
      URL.createObjectURL(file);

    setPreviewWakil(preview);

    setError("");
  };


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      !idWakil ||
      !visi.trim() ||
      !misi.trim() ||
      !fotoKetua ||
      !fotoWakil
    ) {
      setError(
        "Semua data pengajuan wajib diisi."
      );

      return;
    }


    try {
      setSubmitting(true);

      const token =
        localStorage.getItem("token");


      const formData = new FormData();

      formData.append(
        "id_wakil",
        idWakil
      );

      formData.append(
        "visi",
        visi
      );

      formData.append(
        "misi",
        misi
      );

      formData.append(
        "foto_ketua",
        fotoKetua
      );

      formData.append(
        "foto_wakil",
        fotoWakil
      );


      await api.post(
        "/pengajuan",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setSuccess(
        "Pengajuan berhasil dikirim dan menunggu persetujuan admin."
      );


      setIdWakil("");
      setVisi("");
      setMisi("");

      setFotoKetua(null);
      setFotoWakil(null);

      setPreviewKetua(null);
      setPreviewWakil(null);

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        "Pengajuan gagal dikirim."
      );

    } finally {

      setSubmitting(false);

    }
  };


  return (
    <div className="min-h-screen bg-[#F4F7FB]">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 text-sm font-semibold text-[#0A2C51] transition hover:opacity-70"
          >
            <ArrowLeft size={19} />

            Kembali
          </button>

        </div>

      </header>


      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">

        {/* TITLE */}
        <section>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F6BF41]">
            Pendaftaran Paslon
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#0A2C51] sm:text-3xl">
            Calonkan Diri
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Lengkapi informasi pasangan calon Ketua dan Wakil Ketua HIMA
            Informatika UMTAS.
          </p>

        </section>


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* ALERT ERROR */}
          {error && (

            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>

          )}


          {/* ALERT SUCCESS */}
          {success && (

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>

          )}


          {/* DATA PASANGAN */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <h2 className="text-lg font-bold text-[#0A2C51]">
              Data Pasangan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Kamu otomatis terdaftar sebagai calon ketua.
            </p>


            <div className="mt-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Pilih Wakil Ketua
              </label>


              <div className="relative">

                <select
                  value={idWakil}
                  onChange={(event) =>
                    setIdWakil(
                      event.target.value
                    )
                  }
                  disabled={loadingWakil}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm text-slate-700 outline-none transition focus:border-[#F6BF41] focus:bg-white focus:ring-4 focus:ring-[#F6BF41]/15"
                >

                  <option value="">
                    {loadingWakil
                      ? "Memuat mahasiswa..."
                      : "Pilih mahasiswa"}
                  </option>


                  {daftarWakil.map(
                    (mahasiswa) => (

                      <option
                        key={mahasiswa.id}
                        value={mahasiswa.id}
                      >
                        {mahasiswa.nama} - {mahasiswa.nim}
                      </option>

                    )
                  )}

                </select>


                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>

          </section>


          {/* FOTO PASANGAN */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold text-[#0A2C51]">
                  Foto Pasangan
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Gunakan foto formal dengan wajah terlihat jelas.
                  Format JPG, PNG, atau WEBP maksimal 2 MB.
                </p>

              </div>


              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F6BF41]/20 text-[#0A2C51] sm:flex">

                <Camera size={21} />

              </div>

            </div>


            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* FOTO KETUA */}
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-sm font-bold text-[#0A2C51]">
                      Foto Ketua
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Calon Ketua HIMA
                    </p>

                  </div>


                  <span className="rounded-full bg-[#0A2C51]/10 px-3 py-1 text-xs font-semibold text-[#0A2C51]">
                    Ketua
                  </span>

                </div>


                <label className="group mt-4 block cursor-pointer">

                  <div className="relative mx-auto h-56 w-44 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white transition duration-200 group-hover:border-[#F6BF41] group-hover:shadow-sm sm:h-60 sm:w-48">

                    {previewKetua ? (

                      <>
                        <img
                          src={previewKetua}
                          alt="Preview Ketua"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-[#0A2C51]/90 px-3 py-2 text-center text-xs font-semibold text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                          Klik untuk ganti foto
                        </div>
                      </>

                    ) : (

                      <div className="flex h-full flex-col items-center justify-center px-4 text-center">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A2C51] text-[#F6BF41] shadow-sm">

                          <Upload size={20} />

                        </div>

                        <p className="mt-3 text-sm font-bold text-[#0A2C51]">
                          Upload Foto
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Klik untuk memilih foto
                        </p>

                      </div>

                    )}

                  </div>


                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFotoKetua}
                    className="hidden"
                  />

                </label>


                <div className="mt-4 min-h-10">

                  {fotoKetua ? (

                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">

                      <FileImage
                        size={16}
                        className="shrink-0 text-[#F6BF41]"
                      />

                      <p className="truncate text-xs font-medium text-slate-600">
                        {fotoKetua.name}
                      </p>

                    </div>

                  ) : (

                    <p className="text-center text-xs text-slate-400">
                      Belum ada foto dipilih
                    </p>

                  )}

                </div>

              </div>


              {/* FOTO WAKIL */}
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-sm font-bold text-[#0A2C51]">
                      Foto Wakil
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Calon Wakil Ketua HIMA
                    </p>

                  </div>


                  <span className="rounded-full bg-[#F6BF41]/20 px-3 py-1 text-xs font-semibold text-[#0A2C51]">
                    Wakil
                  </span>

                </div>


                <label className="group mt-4 block cursor-pointer">

                  <div className="relative mx-auto h-56 w-44 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white transition duration-200 group-hover:border-[#F6BF41] group-hover:shadow-sm sm:h-60 sm:w-48">

                    {previewWakil ? (

                      <>
                        <img
                          src={previewWakil}
                          alt="Preview Wakil"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-[#0A2C51]/90 px-3 py-2 text-center text-xs font-semibold text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                          Klik untuk ganti foto
                        </div>
                      </>

                    ) : (

                      <div className="flex h-full flex-col items-center justify-center px-4 text-center">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A2C51] text-[#F6BF41] shadow-sm">

                          <Upload size={20} />

                        </div>

                        <p className="mt-3 text-sm font-bold text-[#0A2C51]">
                          Upload Foto
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Klik untuk memilih foto
                        </p>

                      </div>

                    )}

                  </div>


                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFotoWakil}
                    className="hidden"
                  />

                </label>


                <div className="mt-4 min-h-10">

                  {fotoWakil ? (

                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">

                      <FileImage
                        size={16}
                        className="shrink-0 text-[#F6BF41]"
                      />

                      <p className="truncate text-xs font-medium text-slate-600">
                        {fotoWakil.name}
                      </p>

                    </div>

                  ) : (

                    <p className="text-center text-xs text-slate-400">
                      Belum ada foto dipilih
                    </p>

                  )}

                </div>

              </div>

            </div>

          </section>


          {/* VISI MISI */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <h2 className="text-lg font-bold text-[#0A2C51]">
              Visi & Misi
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jelaskan visi dan misi pasangan calon.
            </p>


            <div className="mt-6 space-y-5">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Visi
                </label>

                <textarea
                  value={visi}
                  onChange={(event) =>
                    setVisi(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Tuliskan visi pasangan calon..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#F6BF41] focus:bg-white focus:ring-4 focus:ring-[#F6BF41]/15"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Misi
                </label>

                <textarea
                  value={misi}
                  onChange={(event) =>
                    setMisi(
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder="Tuliskan misi pasangan calon..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#F6BF41] focus:bg-white focus:ring-4 focus:ring-[#F6BF41]/15"
                />

              </div>

            </div>

          </section>


          {/* SUBMIT */}
          <div className="flex justify-end">

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F6BF41] px-6 text-sm font-bold text-[#0A2C51] shadow-sm transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >

              {submitting ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />

                  Mengirim...
                </>
              ) : (
                <>
                  <Send size={18} />

                  Kirim Pengajuan
                </>
              )}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
};


export default PengajuanPage;