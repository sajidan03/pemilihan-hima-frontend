import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/logo.png";

type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    nama: string;
    nim: string;
    username: string;
    role: "mahasiswa" | "admin";
  };
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Terjadi kesalahan saat login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <div className="grid min-h-screen lg:grid-cols-2">

        <section className="relative hidden overflow-hidden bg-[#0A2C51] lg:flex">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white" />
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-[#F6BF41]" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                Informatika UMTAS
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#F6BF41]">
                Pemilihan Ketua HIMA
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Suaramu menentukan arah HIMA Informatika berikutnya.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
                Gunakan hak pilihmu secara bertanggung jawab dan ikuti seluruh
                proses pemilihan melalui satu sistem yang terintegrasi.
              </p>
            </div>

            <p className="text-sm text-white/50">
              Himpunan Mahasiswa Informatika UMTAS
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">

            <div className="mb-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center lg:mx-0">
                <img src={logo} alt="Logo" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#0A2C51]">
                Selamat datang
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Masuk untuk mengakses sistem pemilihan HIMA Informatika.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-5">

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Masukkan username"
                      autoComplete="username"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F6BF41] focus:bg-white focus:ring-4 focus:ring-[#F6BF41]/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F6BF41] focus:bg-white focus:ring-4 focus:ring-[#F6BF41]/15"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0A2C51]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#F6BF41] px-4 text-sm font-bold text-[#0A2C51] shadow-sm transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>

              </div>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Gunakan akun mahasiswa yang telah terdaftar pada sistem.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
};

export default LoginPage;