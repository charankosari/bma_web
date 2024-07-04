const hospitalDetails = {
  1: {
    name: "Apollo Banjara Hills",
    location:
      "https://www.google.com/maps/place/Apollo+Hospitals+Jubilee+Hills+Hyderabad/@17.4153318,78.4127627,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb976634652a37:0xeb778fba80ddd5bf!8m2!3d17.4153318!4d78.4127627!16s%2Fg%2F1tfkd0pr?entry=ttu",
    description: "Description A",
    cards: [
      {
        id: 1,
        name: "cardio",
        icon: "FaHeart",
        image:
          "https://imgs.search.brave.com/ACVeMmIYLVfAl0ifug_INfNJ2AaXAB4c5azaBVV8uww/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNzAx/MjI4MjkyL3Bob3Rv/L21hbGUtY2FyZGlv/bG9naXN0LWRpc2N1/c3Nlcy1kaWFnbm9z/aXMtd2l0aC1wYXRp/ZW50LmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz15cDdQU0Q1/QkJ5Q0hNNXlDWi1I/UFRUQTNkOUpYSUgw/UVZjWWNjQXFObHVF/PQ",
        doctors: [
          {
            id: 1,
            name: "Dr. John Doe",
            specialty: "Cardiology",
            education: "MD in Cardiology, XYZ University",
            experience: "10+ years",
            ratingname: "radha",
            heartcolor: "red",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.",
            rating: "5",
            awards: "Best Cardiologist of the Year, 2020",
            avatar:
              "https://imgs.search.brave.com/2N44cjm0p05IMhtahfLqKmYkiDCgzuZDRQu_fq0FjI8/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzI5LzU2LzEx/LzM2MF9GXzYyOTU2/MTEwOV9ldGxvZ1hv/MzVCczdPd0JjZld0/dTg1YVd0Yjg5UktJ/YS5qcGc",
            review:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna quis felis congue blandit.",
            mapImage: " ",
            location:
              "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.217841336374!2d78.41276271723067!3d17.41533179881995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb976634652a37%3A0xeb778fba80ddd5bf!2sApollo%20Hospitals%20Jubilee%20Hills%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1620768985972!5m2!1sen!2sin",
            image:
              "https://www.apolloclinic.com/assets/images/doctors/2243_DrAvinash.jpg",
          },
          {
            id: 2,
            name: "Dr. Jane Smith",
            specialty: "Cardiology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            rating: "4",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
          {
            id: 3,
            name: "Dr. Jane Smith",
            specialty: "Cardiology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            rating: "5",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
          {
            id: 4,
            name: "Dr. Jane Smith",
            specialty: "Cardiology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            rating: "3",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
          {
            id: 5,
            name: "Dr. Jane Smith",
            specialty: "Cardiology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
        ],
      },
      {
        id: 2,
        name: "neuro",
        icon: "FaBrain",
        image:
          "https://imgs.search.brave.com/nUpfjdpaRKqa3Mpiv7AU172-gotxqqMrkvS98e6MZA0/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9o/dW1hbi1icmFpbi1h/bmF0b215LW5lcnZl/LWNlbGxzLXN5bmFw/c2VzLWdlbmVyYXRl/ZC1ieS1haV8xODg1/NDQtMjE5ODQuanBn/P3NpemU9NjI2JmV4/dD1qcGc",
        backgroundColor: "#99ccff",
        doctors: [
          {
            id: 1,
            name: "Dr. lee",
            specialty: "neurology",
            contact: "123-456-7890",
            address: "123 Street, City",
            bio: "Dr. John Doe is an experienced cardiologist with expertise in...",
            education: "MD in Cardiology, XYZ University",
            experience: "10+ years",
            awards: "Best Cardiologist of the Year, 2020",
            image:
              "https://imgs.search.brave.com/WooNiPEFicNOv9qSI7wpUa-XDfwN8_ldHpTPR1Nwnis/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9p/LXRyeWluZy1iZS1i/ZXN0LWRvY3Rvcl8z/MjkxODEtMjE4OC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw", // Path to doctor image
          },
          {
            id: 2,
            name: "Dr. Jane Smith",
            specialty: "neurology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
          {
            id: 3,
            name: "Dr. Jane Smith",
            specialty: "neurology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
          {
            id: 4,
            name: "Dr. Jane Smith",
            specialty: "neurology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
          {
            id: 5,
            name: "Dr. Jane Smith",
            specialty: "neurology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
        ],
      },
      {
        id: 3,
        name: "eye",
        icon: "FaEye",
        image:
          "https://imgs.search.brave.com/wlzcCsFhpA4rbP0PPAgempJBD3slUOTNdcd1VNHaG8c/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by8zZC1yZW5kZXJl/ZC1waG90by1leWUt/Y29ybmVhLWRlc2ln/bl84MDQwMDctMTMy/MzguanBnP3NpemU9/NjI2JmV4dD1qcGc",
        backgroundColor: "#ffcc00",
        doctors: [
          {
            id: 1,
            name: "Dr. Emily Wong",
            specialty: "Ophthalmology",
            contact: "123-456-7890",
            address: "123 Street, City",
            bio: "Dr. Emily Wong is an ophthalmologist specializing in eye care...",
            education: "MD in Ophthalmology, LMN University",
            experience: "8+ years",
            awards: "Excellence in Ophthalmology, 2021",
            image: "https://example.com/doctor-image.jpg",
          },
          // Add more ophthalmologists if needed
        ],
      },
      {
        id: 4,
        name: "hair",
        icon: "FaCut",
        image:
          "https://imgs.search.brave.com/oi5DTw2rDtRS2w57FMKpnflqHGwyubc4n0fhI1IzQhs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ2/OTE1NDM3Mi9waG90/by91cHNldC1taWRk/bGUtYWdlZC13b21h/bi1jaGVja2luZy1o/ZXItaGFpci53ZWJw/P2I9MSZzPTE3MDY2/N2Emdz0wJms9MjAm/Yz03Ml9DNDE2T1Ji/YnNISzIzR1lpekZr/ajgtSHFrdk9qckd6/WEt1R2M0YkdFPQ",
        backgroundColor: "#ff6699",
        doctors: [
          {
            id: 1,
            name: "Dr. Mark Johnson",
            specialty: "Trichology",
            contact: "123-456-7890",
            address: "123 Street, City",
            bio: "Dr. Mark Johnson is a trichologist specializing in hair care...",
            education: "PhD in Trichology, PQR University",
            experience: "10+ years",
            awards: "Hair Care Innovator Award, 2020",
            image: "https://example.com/doctor-image.jpg",
          },
          // Add more trichologists if needed
        ],
      },
      {
        id: 5,
        name: "teeth",
        icon: "FaTeeth",
        image:
          "https://imgs.search.brave.com/4PYAr1MY5-umt8pYSHZL3pQTBmdINgJ2z_7ihqZaMpU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by93/aGl0ZS10ZWV0aF8x/NDQ2MjctNjUyNS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
        doctors: [
          {
            id: 1,
            name: "Dr. Sarah Lee",
            specialty: "Orthodontist",
            education: "MD in Orthodontist, XYZ University",
            experience: "12+ years",
          },
        ],
      },
      {
        id: 6,
        name: "kidney",
        icon: "GiKidneys",
        image:
          "https://imgs.search.brave.com/nG5MIein3xjs621WdY9zqlg0PAqp2k7a79DjZwi7XDM/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93cDA0/LW1lZGlhLmNkbi5p/aGVhbHRoc3BvdC5j/b20vd3AtY29udGVu/dC91cGxvYWRzL3Np/dGVzLzM0Mi8yMDIz/LzA4L2lTdG9jay05/MTIwMTg2MzQtMzAw/eDIwMC5qcGc",
        doctors: [
          {
            id: 1,
            name: "Dr. Sarah Lee",
            specialty: "nephrologist",
            education: "MD in nephrologists, XYZ University",
            experience: "12+ years",
          },
        ],
      },
      {
        id: 7,
        name: "legs",
        image:
          "https://imgs.search.brave.com/M8Hqr8BauxVmoYlSxupylc4w6yrFTDAtJwzpLEiLE-U/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9uanZ2/Yy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDQvTGVn/LVBhaW4uanBn",
        doctors: [
          {
            id: 1,
            name: "Dr. Sarah Lee",
            specialty: "Orthopedic",
            education: "MD in Orthopedic, XYZ University",
            experience: "12+ years",
          },
        ],
      },
      {
        id: 8,
        name: "skin",
        image:
          "https://imgs.search.brave.com/-qjPfEXeFlecbN6GgLZVoKTH9hpd32RYSlim7GLYDCY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtZ2xvYmFsLndl/YnNpdGUtZmlsZXMu/Y29tLzVlOWU1Zjc2/YmFiY2U2ZTg3OWQw/NTVjMi82MDYxMTdi/MTJkZmE2MDRmNmJi/YjNjYWFfc2Vydmlj/ZV9za2luY2hlY2su/d2VicA",
        doctors: [
          {
            id: 1,
            name: "Dr. Sarah Lee",
            specialty: "Dermatology",
            education: "MD in Dermatology, XYZ University",
            experience: "12+ years",
          },
        ],
      },
      {
        id: 8,
        name: "teeth",
        icon: "FaTeeth",
        image:
          "https://imgs.search.brave.com/4PYAr1MY5-umt8pYSHZL3pQTBmdINgJ2z_7ihqZaMpU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by93/aGl0ZS10ZWV0aF8x/NDQ2MjctNjUyNS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
        doctors: [
          {
            id: 1,
            name: "Dr. Sarah Lee",
            specialty: "Dermatology",
            education: "MD in Dermatology, XYZ University",
            experience: "12+ years",
          },
        ],
      },
    ],
  },
  2: {
    name: "Yashoda",
    location: "Location B",
    description: "Description B",
    cards: [
      {
        id: 1,
        icon: "FaHeart",
        backgroundColor: "#ff9999",
        name: "cardio",
        doctors: [
          {
            id: 1,
            name: "Dr. John Doe",
            specialty: "Cardiology",
            contact: "123-456-7890",
            address: "123 Street, City",
            bio: "Dr. John Doe is an experienced cardiologist with expertise in...",
            education: "MD in Cardiology, XYZ University",
            experience: "10+ years",
            awards: "Best Cardiologist of the Year, 2020",
            image:
              "https://imgs.search.brave.com/WooNiPEFicNOv9qSI7wpUa-XDfwN8_ldHpTPR1Nwnis/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9p/LXRyeWluZy1iZS1i/ZXN0LWRvY3Rvcl8z/MjkxODEtMjE4OC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw", // Path to doctor image
          },
          {
            id: 2,
            name: "Dr. Jane Smith",
            specialty: "Cardiology",
            contact: "456-789-0123",
            address: "456 Avenue, Town",
            bio: "Dr. Jane Smith is a renowned neurologist known for her research...",
            education: "MBBS, ABC Medical College",
            experience: "15+ years",
            awards: "Lifetime Achievement Award in Cardiology",
            image:
              "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
          },
        ],
      },
    ],
  },
  // Add more hospital details as needed
};

export default hospitalDetails;
