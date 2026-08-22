import { useState, useRef } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, imageApi, tripApi, discoveryApi, type ApiImage } from "@/api/client";
import { useAuth } from "@/_core/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import { UploadCloud, Trash2, Image as ImageIcon, CheckCircle, BarChart3, Layers, Filter } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"analytics" | "images">("analytics");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadCategory, setUploadCategory] = useState<string>("trip");
  const [uploadEntityId, setUploadEntityId] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyticsQuery = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminApi.analytics,
    enabled: user?.role === "admin",
  });

  const imagesQuery = useQuery({
    queryKey: ["admin", "images", selectedCategory],
    queryFn: () => imageApi.list(selectedCategory === "all" ? undefined : selectedCategory),
    enabled: user?.role === "admin",
  });

  const tripsQuery = useQuery({
    queryKey: ["trips", "admin-list"],
    queryFn: () => tripApi.list(),
    enabled: user?.role === "admin" && uploadCategory === "trip",
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", "admin-list"],
    queryFn: () => discoveryApi.cities(),
    enabled: user?.role === "admin" && uploadCategory === "city",
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, category, entityId }: { file: File; category: string; entityId?: string }) =>
      imageApi.upload(file, category, entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "images"] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      queryClient.invalidateQueries({ queryKey: ["discovery"] });
      setUploadStatus("Image uploaded successfully!");
      setTimeout(() => setUploadStatus(""), 4000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (err: any) => {
      setUploadStatus(`Upload failed: ${err.message || "Unknown error"}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => imageApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "images"] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
    },
  });

  const analytics = analyticsQuery.data;
  const cards = analytics
    ? [
        [String(analytics.totalTrips), "Trips started"],
        [String(analytics.activeUsers), "Active explorers"],
        [
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(analytics.averageBudget),
          "Average trip budget",
        ],
      ]
    : [];

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    uploadMutation.mutate({
      file,
      category: uploadCategory,
      entityId: uploadEntityId || undefined,
    });
  };

  const imagesList = imagesQuery.data?.items ?? [];

  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Admin workspace"
          title={
            <>
              Platform management
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Live, role-protected analytics and media management for World Trotter."
          action={
            <div className="flex rounded-full border border-[var(--line)] bg-white p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeTab === "analytics"
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--ink-muted)] hover:text-[var(--navy)]"
                }`}
              >
                <BarChart3 size={14} /> Analytics
              </button>
              <button
                onClick={() => setActiveTab("images")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  activeTab === "images"
                    ? "bg-[var(--navy)] text-white"
                    : "text-[var(--ink-muted)] hover:text-[var(--navy)]"
                }`}
              >
                <ImageIcon size={14} /> Images Gallery
              </button>
            </div>
          }
        />

        {user?.role !== "admin" ? (
          <div className="mt-10 rounded-[28px] bg-[var(--sand)] p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              Administrator access is required.
            </p>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              Sign in with an administrator account (`admin@worldtrotter.app`) to access this area.
            </p>
          </div>
        ) : activeTab === "analytics" ? (
          analyticsQuery.isLoading ? (
            <div className="mt-10 h-64 animate-pulse rounded-[28px] bg-[var(--sand)]" />
          ) : (
            <>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {cards.map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[24px] bg-[var(--sand)] p-6"
                  >
                    <p className="font-serif text-4xl font-bold text-[var(--navy)]">
                      {value}
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--ink-muted)]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white p-7">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                  Most planned places
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--navy)]">
                  Destinations attracting the most attention
                </h2>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        analytics?.popularDestinations.map(item => ({
                          name: item._id,
                          plans: item.count,
                        })) ?? []
                      }
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6f7c80", fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "#f5efe6" }} />
                      <Bar
                        dataKey="plans"
                        fill="#17314a"
                        radius={[9, 9, 0, 0]}
                        isAnimationActive
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )
        ) : (
          /* Images Tab */
          <div className="mt-8 space-y-8">
            {/* Upload Area */}
            <div className="rounded-[28px] border border-[var(--line)] bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-[var(--navy)]">
                Upload New Image
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Uploaded images are saved directly on disk and served through the backend.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Target Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={e => {
                      setUploadCategory(e.target.value);
                      setUploadEntityId("");
                    }}
                    className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none"
                  >
                    <option value="trip">Trip Cover</option>
                    <option value="city">City Photo</option>
                    <option value="activity">Activity Photo</option>
                    <option value="community">Community Post</option>
                    <option value="avatar">User Avatar</option>
                  </select>
                </div>

                {uploadCategory === "trip" && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      Attach Directly to Trip (Optional)
                    </label>
                    <select
                      value={uploadEntityId}
                      onChange={e => setUploadEntityId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none"
                    >
                      <option value="">-- Do not attach immediately --</option>
                      {tripsQuery.data?.items.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {uploadCategory === "city" && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      Attach Directly to City (Optional)
                    </label>
                    <select
                      value={uploadEntityId}
                      onChange={e => setUploadEntityId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none"
                    >
                      <option value="">-- Do not attach immediately --</option>
                      {citiesQuery.data?.items.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name}, {c.country}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Drag & drop upload box */}
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  handleFileSelect(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--canvas)] p-8 text-center transition-colors hover:border-[var(--gold)] hover:bg-[var(--sand)]"
              >
                <UploadCloud size={36} className="text-[var(--gold)]" />
                <p className="mt-3 text-sm font-bold text-[var(--navy)]">
                  Click to browse or drop an image here
                </p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  JPEG, PNG, WebP, AVIF, or GIF up to 8 MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={e => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {uploadMutation.isPending && (
                <p className="mt-3 text-sm font-bold text-[var(--gold)]">
                  Uploading image to server…
                </p>
              )}
              {uploadStatus && (
                <p className={`mt-3 text-sm font-bold ${uploadStatus.includes("failed") ? "text-red-600" : "text-green-700"}`}>
                  {uploadStatus}
                </p>
              )}
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-[var(--navy)]">
                  Stored Media Gallery ({imagesList.length})
                </h3>

                {/* Filter by Category */}
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-[var(--ink-muted)]" />
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--navy)] outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="trip">Trip Covers</option>
                    <option value="city">Cities</option>
                    <option value="activity">Activities</option>
                    <option value="community">Community</option>
                    <option value="avatar">Avatars</option>
                  </select>
                </div>
              </div>

              {imagesQuery.isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-56 animate-pulse rounded-2xl bg-[var(--sand)]" />
                  ))}
                </div>
              ) : imagesList.length === 0 ? (
                <div className="rounded-2xl border border-[var(--line)] bg-white p-10 text-center">
                  <ImageIcon size={32} className="mx-auto text-[var(--ink-muted)]" />
                  <p className="mt-3 font-serif text-xl font-bold text-[var(--navy)]">
                    No uploaded images in this category yet
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    Upload an image above to store it on the server.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {imagesList.map((img: ApiImage) => (
                    <div
                      key={img._id}
                      className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="relative h-44 overflow-hidden bg-[var(--sand)]">
                        <img
                          src={img.url}
                          alt={img.originalName}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[var(--navy)]/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                          {img.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="truncate text-xs font-bold text-[var(--navy)]" title={img.originalName}>
                          {img.originalName}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                          <span>{Math.round(img.sizeBytes / 1024)} KB</span>
                          <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3">
                          <span className="truncate text-[10px] text-[var(--ink-muted)]" title={img.url}>
                            {img.url}
                          </span>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete image "${img.originalName}" from server?`)) {
                                deleteMutation.mutate(img._id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                            title="Delete image"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
