# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-07_

## Trạng thái hiện tại
- **Giai đoạn:** 3 – Cài đặt & kiểm thử tự động (đang làm F1)
- **URL production:** chưa có

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | ✅ Hoàn thành |
| 2. Thiết kế (Mermaid flowchart) | ✅ Đã duyệt (2026-10-07) |
| 3. Cài đặt & kiểm thử tự động | 🔄 Đang làm |
| 4. Kiểm thử người dùng (UAT) | ⏳ Chưa bắt đầu |
| 5. Triển khai Vercel | ⏳ Chưa bắt đầu |

| Chức năng | Thiết kế | Cài đặt | Unit test | UAT |
|-----------|----------|---------|-----------|-----|
| F1 – Thêm môn học | ✅ | ☐ | ☐ | ☐ |
| F2 – Quy đổi điểm | ✅ | ☐ | ☐ | ☐ |
| F3 – Tính GPA | ✅ | ☐ | ☐ | ☐ |
| F4 – Sửa/xoá môn | ✅ | ☐ | ☐ | ☐ |
| F5 – Lưu dữ liệu | ✅ | ☐ | ☐ | ☐ |

## Quyết định kỹ thuật
| Ngày | Quyết định | Lý do |
|------|------------|-------|
| 2026-10-07 | Quy trình phát triển theo mô hình Waterfall (PRD → thiết kế → cài đặt & test → UAT → deploy) | Theo yêu cầu của anh yêu |
| 2026-10-07 | Vite + HTML/CSS/JS thuần, Vitest, Vercel | Theo PRD mục 3 |
| 2026-10-07 | Tách logic thuần (validation, quy đổi, GPA, storage) khỏi DOM | Để unit test bằng Vitest không cần trình duyệt |
| 2026-10-07 | Flowchart thiết kế đặt trong `docs/flowcharts.md` | Gom tài liệu thiết kế một chỗ |
| 2026-10-07 | Thiết kế được duyệt, gồm cả 6 "Điểm cần anh yêu duyệt" trong `docs/flowcharts.md` | Anh yêu yêu cầu bắt đầu cài đặt |
| 2026-10-07 | Mỗi chức năng làm trên một nhánh riêng từ `main`, chỉ merge khi test pass và build thành công | Theo yêu cầu của anh yêu (ghi trong `CLAUDE.md`) |

## Thay đổi so với ban đầu
| Ngày | Thay đổi | Lý do | Ảnh hưởng |
|------|----------|-------|-----------|
| 2026-10-07 | Khởi tạo lại lịch sử git, repo chuyển sang `taitapcode883/study-AI` | Bắt đầu dự án mới từ template | Mất 2 commit cũ (PRD) trong lịch sử; nội dung PRD giữ nguyên |

## Lỗi / góp ý từ UAT
_Chưa có._
