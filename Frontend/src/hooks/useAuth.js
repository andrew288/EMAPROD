import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user");
    const navigate = useNavigate();

    const login = async (data) => {
        // ACTUALIZAMOS EL LOCAL STORAGE
        setUser(data);
        const { idAre } = data;

        // REDIRECCIONAMOS AL USUARIO A UNA RUTA ADECUADA
        switch (idAre) {
            case 1: navigate("/almacen", { replace: true });
                break;
            case 2: navigate("/molienda", { replace: true });
                break;
            case 3: navigate("/seleccion", { replace: true });
        };
    };

    const logout = () => {
        setUser(null);
        navigate("/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            login,
            logout
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
