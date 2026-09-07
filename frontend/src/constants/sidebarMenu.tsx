import HomeIcon from "@mui/icons-material/Home";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
// import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
// import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";

export type MenuItem = {
    label: string;
    path: string;
    icon: React.ReactNode;
};

export const citizenMenu: MenuItem[] = [
    {
        label: "Citizen Dashboard",
        path: "/citizen/dashboard",
        icon: <HomeIcon />,
    },
    {
        label: "My Complaints",
        path: "/citizen/complaints",
        icon: <NoteAltIcon />,
    },
    {
        label: "Create Complaint",
        path: "/citizen/complaints/create",
        icon: <AddIcon />
    },
    {
        label: "Profile",
        path: "/profile",
        icon: <PersonIcon />
    }
];

export const adminMenu: MenuItem[] = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <HomeIcon />
    },
    {
        label: "Complaints",
        path: "/admin/complaints",
        icon: <NoteAltIcon />
    },
    // {
    //     label: "Users",
    //     path: "/admin/users",
    //     icon: <GroupIcon />
    // },
    {
        label: "Departments",
        path: "/admin/departments",
        icon: <SettingsIcon />
    },
    {
        label: "feedback",
        path: "/admin/feedback",
        icon: <FeedbackOutlinedIcon />
    },
    {
        label: "Reports",
        path: "/admin/reports",
        icon: <AssessmentOutlined />
    }
];

export const officerMenu: MenuItem[] = [
    {
        label: "Officer Dashboard",
        path: "/officer/dashboard",
        icon: <HomeIcon />
    },
    // {
    //     label: "Users",
    //     path: "/users",
    //     icon: <GroupIcon />
    // },
    // {
    //     label: "Departments",
    //     path: "/departments",
    //     icon: <SettingsIcon />
    // },
    // {
    //     label: "Complaints",
    //     path: "/complaints",
    //     icon: <NoteAltIcon />
    // },
    // {
    //     label: "Reports",
    //     path: "/reports",
    //     icon: <DescriptionIcon />
    // }
];

export const workerMenu: MenuItem[] = [
    {
        label: "Worker Dashboard",
        path: "/worker/dashboard",
        icon: <HomeIcon />
    },
    // {
    //     label: "Users",
    //     path: "/users",
    //     icon: <GroupIcon />
    // },
    // {
    //     label: "Departments",
    //     path: "/departments",
    //     icon: <SettingsIcon />
    // },
    {
        label: "Assigned Complaints",
        path: "/worker/complaints",
        icon: <NoteAltIcon />
    },
    {
        label: "Reports",
        path: "/admin/reports",
        icon: <AssessmentOutlined />
    }
];