export const warrantyPolicyData = {
  hero: {
    title: "Thông Tin & Chính Sách Bảo Hành",
    subtitle: "Chúng tôi cam kết mang đến dịch vụ hậu mãi tốt nhất, đảm bảo quyền lợi và sự an tâm tuyệt đối cho khách hàng sử dụng sản phẩm chính hãng của SMARTRETAIL.",
    bgImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2070",
    cta: [
      { label: "Kiểm tra bảo hành", link: "/", primary: true },
      { label: "Tìm trung tâm hỗ trợ", link: "#support", primary: false }
    ]
  },
  coverage: {
    categories: [
      {
        id: "main",
        label: "Thiết bị chính",
        items: [
          { name: "Màn Hình Quảng Cáo", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi từ nhà sản xuất" },
          { name: "Màn Hình Treo Tường", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi từ nhà sản xuất" },
          { name: "Màn Hình Tương Tác", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi từ nhà sản xuất" },
          { name: "Màn Hình Chân Quỳ", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi từ nhà sản xuất" },
          { name: "Màn Hình Ghép", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi từ nhà sản xuất" },
          { name: "Màn Hình LED", period: "24 Tháng", type: "Sửa chữa/Thay thế", scope: "Lỗi từ nhà sản xuất" },
        ]
      },
      {
        id: "acc",
        label: "Phụ kiện",
        items: [
          { name: "Bút tương tác", period: "06 Tháng", type: "Đổi mới", scope: "Lỗi cảm ứng, không nhận tín hiệu" },
          { name: "Giá treo/Chân đế", period: "12 Tháng", type: "Thay thế", scope: "Lỗi kết cấu, mối hàn" },
          { name: "Cáp kết nối", period: "03 Tháng", type: "Đổi mới", scope: "Đứt ngầm, không truyền dữ liệu" },
          { name: "Máy tính OPS", period: "12 Tháng", type: "Sửa chữa", scope: "Lỗi linh kiện, nguồn, bo mạch" },
          { name: "Tấm nền", period: "24 Tháng", type: "Thay", scope: "Sọc màn, Đen màn" },

        ]
      },
      {
        id: "parts",
        label: "Linh kiện tiêu hao",
        items: [
          { name: "Dây nguồn, Ăngten", period: "06 Tháng", type: "Thay thế", scope: "Hư hỏng" },
          { name: "Điều khiển (Remote)", period: "06 Tháng", type: "Đổi mới", scope: "Lỗi phím bấm, mắt nhận" }
        ]
      }
    ]
  },
  policies: [
    {
      title: "Điều kiện được bảo hành",
      subtitle:"Thời gian bảo hành: 12 tháng cho toàn hệ thống và/hoặc cho từng thiết bị theo qui định của Nhà sản xuất. Chúng tôi căn cứ vào PHIẾU BẢO HÀNH để quản lý bảo hành cho Quý khách hàng. Ngoài ra chúng tôi căn cứ vào các chứng từ liên quan khác tùy vào Hợp đồng; Đơn hàng; Dự án; Công trình thực hiện, như:",
      content: [
        "Sản phẩm còn trong thời hạn bảo hành tính đến thời điểm yêu cầu.",
        "Sản phẩm có số Serial/IMEI trùng khớp với hệ thống quản lý.",
        "Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.",
        "Tem niêm phong của SMARTRETAIL còn nguyên vẹn, không có dấu hiệu tẩy xóa, rách rời."
      ]
    },
    {
      title: "Trường hợp không được bảo hành",
      content: [
        "Sản phẩm hết hạn bảo hành.",
        "Hư hỏng do thiên tai, hỏa hoạn, côn trùng xâm nhập.",
        "Sản phẩm bị biến dạng, nứt vỡ, trầy xước do tác động ngoại lực.",
        "Tự ý tháo gỡ, sửa chữa tại các đơn vị không thuộc ủy quyền của SMARTRETAIL.",
        "Sử dụng sai điện áp hoặc phụ kiện không chính hãng gây cháy nổ."
      ]
    },
    {
      title: "Quy trình xử lý bảo hành",
      content: [
        "Bước 1: Tiếp nhận yêu cầu qua Hotline hoặc Website.",
        "Bước 2: Kiểm tra tình trạng bảo hành online.",
        "Bước 3: Khách hàng gửi thiết bị hoặc kỹ thuật viên đến tận nơi (tùy gói dịch vụ).",
        "Bước 4: Thông báo tình trạng và thời gian xử lý (Thường từ 3-7 ngày làm việc)."
      ]
    }
  ],
  support: [
    { title: "Hotline Liên hệ", desc: "Hotline: 0935888489", icon: "PhoneCall", cta: "Gọi ngay", link: "tel:0935888489" },
    { title: "Hỗ trợ trực tuyến ", desc: "Liên hệ (Zalo/SĐT): 0909 045 663", icon: "MessageSquare", cta: "Chat ngay", link: "https://zalo.me/0909045663" },
    { title: "Trung tâm bảo hành", desc: "A60 Tô Ký, P. Đông Hưng Thuận, Quận 12, TP.HCM ", icon: "MapPin", cta: "Tìm kiếm", link: "https://maps.google.com/?q=A60 Tô Ký, P. Đông Hưng Thuận, Quận 12, TP.HCM" },
    { title: "Gửi Yêu Cầu", desc: "Tạo phiếu yêu cầu sủa chữa trực tuyến.", icon: "PenTool", cta: "Gửi ngay", link: "/yeu-cau-sua-chua" }
  ]
};
