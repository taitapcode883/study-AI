# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-07_

## Trạng thái hiện tại
- **Giai đoạn:** 2 – Thiết kế luồng nghiệp vụ (đã vẽ xong flowchart, chờ anh yêu duyệt)
- **URL production:** chưa có

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | ✅ Hoàn thành |
| 2. Thiết kế (Mermaid flowchart) | 🔄 Chờ duyệt |
| 3. Cài đặt & kiểm thử tự động | ⏳ Chưa bắt đầu |
| 4. Kiểm thử người dùng (UAT) | ⏳ Chưa bắt đầu |
| 5. Triển khai Vercel | ⏳ Chưa bắt đầu |

| Chức năng | Thiết kế | Cài đặt | Unit test | UAT |
|-----------|----------|---------|-----------|-----|
| F1 – Thêm môn học | ✅ (chờ duyệt) | ☐ | ☐ | ☐ |
| F2 – Quy đổi điểm | ✅ (chờ duyệt) | ☐ | ☐ | ☐ |
| F3 – Tính GPA | ✅ (chờ duyệt) | ☐ | ☐ | ☐ |
| F4 – Sửa/xoá môn | ✅ (chờ duyệt) | ☐ | ☐ | ☐ |
| F5 – Lưu dữ liệu | ✅ (chờ duyệt) | ☐ | ☐ | ☐ |

## Quyết định kỹ thuật
| Ngày | Quyết định | Lý do |
|------|------------|-------|
| 2026-10-07 | Quy trình phát triển theo mô hình Waterfall (PRD → thiết kế → cài đặt & test → UAT → deploy) | Theo yêu cầu của anh yêu |
| 2026-10-07 | Vite + HTML/CSS/JS thuần, Vitest, Vercel | Theo PRD mục 3 |
| 2026-10-07 | Tách logic thuần (validation, quy đổi, GPA, storage) khỏi DOM | Để unit test bằng Vitest không cần trình duyệt |
| 2026-10-07 | Flowchart thiết kế đặt trong `docs/flowcharts.md` | Gom tài liệu thiết kế một chỗ |

## Thay đổi so với ban đầu
| Ngày | Thay đổi | Lý do | Ảnh hưởng |
|------|----------|-------|-----------|
| 2026-10-07 | Khởi tạo lại lịch sử git, repo chuyển sang `taitapcode883/study-AI` | Bắt đầu dự án mới từ template | Mất 2 commit cũ (PRD) trong lịch sử; nội dung PRD giữ nguyên |

## Lỗi / góp ý từ UAT
_Chưa có._
